import {
  getInput,
  getMultilineInput,
  info,
  setFailed,
  warning,
} from '@actions/core'
import { getOctokit } from '@actions/github'
import { glob } from 'glob'
import { promises as fs } from 'fs'
import { join, basename, dirname, relative } from 'path'
import { getBooleanInput } from '../../lib/core'
import { getRepository, getToken, getSha } from '../../lib/github'

interface FileMapping {
  sourcePath: string
  destinationPath: string
}

interface PushConfig {
  centralRepoOwner: string
  centralRepoName: string
  centralRepoBranch: string
  sourceRepoName: string
  files: string[]
  folders: string[]
  ghToken: string
  dryRun: boolean
}

function parseInput(inputName: string): string[] {
  // Try multiline input first
  const multilineInput = getMultilineInput(inputName)
  if (multilineInput.length > 0) {
    return multilineInput.filter((item) => item.trim().length > 0)
  }

  // Fall back to comma-separated input
  const singleLineInput = getInput(inputName)
  if (!singleLineInput.trim()) return []
  return singleLineInput
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function getDestinationPath(
  sourcePath: string,
  sourceRepoName: string,
): string {
  const fileName = basename(sourcePath)

  if (fileName.toLowerCase() === 'readme.md') {
    return `README_sources/${sourceRepoName}/README.md`
  }

  if (fileName.endsWith('.schema.json')) {
    return `schemas/${sourceRepoName}/${fileName}`
  }

  if (sourcePath.startsWith('templates/')) {
    // Preserve folder structure for templates
    const relativePath = sourcePath.replace(/^templates\//, '')
    return `templates/${sourceRepoName}/${relativePath}`
  }

  // Default: put in a general folder
  return `files/${sourceRepoName}/${fileName}`
}

async function collectFileMappings(config: PushConfig): Promise<FileMapping[]> {
  const mappings: FileMapping[] = []

  // Process individual files (including glob patterns)
  for (const filePattern of config.files) {
    try {
      // Use glob to find files matching the pattern
      const matchedFiles = await glob(filePattern, {
        ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
        nodir: true,
      })

      if (matchedFiles.length === 0) {
        // If no glob matches, try as direct file
        try {
          await fs.access(filePattern)
          matchedFiles.push(filePattern)
        } catch {
          warning(`File or pattern "${filePattern}" not found, skipping`)
          continue
        }
      }

      for (const file of matchedFiles) {
        mappings.push({
          sourcePath: file,
          destinationPath: getDestinationPath(file, config.sourceRepoName),
        })
      }
    } catch (error) {
      warning(`Error processing file pattern "${filePattern}": ${error}`)
    }
  }

  // Process folders
  for (const folder of config.folders) {
    try {
      const stat = await fs.stat(folder)
      if (!stat.isDirectory()) {
        warning(`"${folder}" is not a directory, skipping`)
        continue
      }

      const files = await glob(`${folder}/**/*`, {
        ignore: ['node_modules/**', '.git/**'],
        nodir: true,
      })

      for (const file of files) {
        mappings.push({
          sourcePath: file,
          destinationPath: getDestinationPath(file, config.sourceRepoName),
        })
      }
    } catch (error) {
      warning(`Folder "${folder}" not found, skipping`)
    }
  }

  return mappings
}

async function readFileContent(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read file "${filePath}": ${error}`)
  }
}

async function createOrUpdateFile(
  octokit: ReturnType<typeof getOctokit>,
  owner: string,
  repo: string,
  branch: string,
  path: string,
  content: string,
  message: string,
): Promise<void> {
  const contentBase64 = Buffer.from(content, 'utf8').toString('base64')

  try {
    // Try to get existing file
    const existingFile = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    })

    if ('sha' in existingFile.data) {
      // Update existing file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: contentBase64,
        branch,
        sha: existingFile.data.sha,
      })
      info(`Updated: ${path}`)
    }
  } catch (error: any) {
    if (error.status === 404) {
      // Create new file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: contentBase64,
        branch,
      })
      info(`Created: ${path}`)
    } else {
      throw error
    }
  }
}

async function run() {
  try {
    // Parse inputs
    const { owner: sourceOwner, repo: sourceRepo } = getRepository()
    const ghToken = getInput('gh-token', { required: true })

    const config: PushConfig = {
      centralRepoOwner: getInput('central-repo-owner', { required: true }),
      centralRepoName: getInput('central-repo-name', { required: true }),
      centralRepoBranch: getInput('central-repo-branch') || 'main',
      sourceRepoName: sourceRepo,
      files: parseInput('files'),
      folders: parseInput('folders'),
      ghToken,
      dryRun: getBooleanInput('dry-run', false),
    }

    // Validate inputs
    if (config.files.length === 0 && config.folders.length === 0) {
      throw new Error('At least one of files or folders must be provided')
    }

    // Initialize GitHub client
    const octokit = getOctokit(config.ghToken)

    // Collect all file mappings
    info('Collecting files to push...')
    const mappings = await collectFileMappings(config)

    if (mappings.length === 0) {
      warning('No files found to push')
      return
    }

    info(`Found ${mappings.length} files to push:`)
    for (const mapping of mappings) {
      info(`  ${mapping.sourcePath} → ${mapping.destinationPath}`)
    }

    if (config.dryRun) {
      info('Dry run mode - no changes will be made')
      return
    }

    // Push files
    info(
      `Pushing files to ${config.centralRepoOwner}/${config.centralRepoName}:${config.centralRepoBranch}...`,
    )

    const commitMessage = `Update files from ${sourceOwner}/${sourceRepo}`

    for (const mapping of mappings) {
      try {
        const content = await readFileContent(mapping.sourcePath)
        await createOrUpdateFile(
          octokit,
          config.centralRepoOwner,
          config.centralRepoName,
          config.centralRepoBranch,
          mapping.destinationPath,
          content,
          commitMessage,
        )
      } catch (error) {
        warning(`Failed to push ${mapping.sourcePath}: ${error}`)
      }
    }

    info('✅ Push completed successfully!')
  } catch (error) {
    setFailed(`Action failed: ${error}`)
  }
}

run().catch(setFailed)
