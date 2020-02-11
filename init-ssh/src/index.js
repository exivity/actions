const { getInput, setOutput, setFailed } = require('@actions/core')
const { exec } = require('@actions/exec')

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// ssh-keyscan -t rsa -H bitbucket.org
const BITBUCKET_RSA_KEY = `# bitbucket.org: 22 SSH - 2.0 - conker_04c2dec4ed app - 154\n
|1|Pye78m1lT/hc5ffBc7ObT122fsQ=|Fh2jRC98G9aMcd35o05HX3dbfsc= ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAubiN81eDcafrgMeLzaFPsw2kNvEcqTKl/VqLat/MaB33pZy0y3rJZtnqwR2qOOvbwKZYKiEO1O6VqNEBxKvJJelCq0dTXWT5pbO2gDXC6h6QDXCaHo6pOHGPUy+YBaGQRGuSusMEASYiWunYN0vCAI8QaXnWMXNMdFP3jHAJH0eDsoiGnLPBlBp4TNm6rYI74nMzgz3B9IikW4WVK+dc8KZJZWYjAuORU3jc1c/NPskD2ASinf8v3xnfXeukU0sJ5N6m5E8VLjObPEO+mN2t/FZTMZLiFqPWc/ALSqnMnnhwrNi2rbfg/rd/IpL8Le3pSBne8+seeFVBoGqzHM9yXw==`

// ssh-keyscan -t rsa -H github.com
const GITHUB_RSA_KEY = `# github.com:22 SSH-2.0-babeld-907b992b\n
|1|ZBytb05KSPSbPd/iL9FmjUEssrg=|8lHTHIjIP+a+QDyrUMC1lrDlzEs= ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==`

// ssh-keyscan -t rsa -H gitlab.com
const GITLAB_RSA_KEY = `# gitlab.com:22 SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8\n
|1|zPD64TkJzf/hSS2v94AqP8GoqyI=|243xrb26itevrjdFd1ymPDaJ5J0= ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsj2bNKTBSpIYDEGk9KxsGh3mySTRgMtXL583qmBpzeQ+jqCMRgBqB98u3z++J1sKlXHWfM9dyhSevkMwSbhoR8XIq/U0tCNyokEi/ueaBMCvbcTHhO7FcwzY92WK4Yt0aGROY5qX2UKSeOvuP4D6TPqKF1onrSzH9bx9XUf2lEdWT/ia1NEKjunUqu1xOB/StKDHMoX4/OKyIzuS0q/T1zOATthvasJFoPrAjkohTyaDUz2LN5JoH839hViyEG82yB+MjcFV5MU3N1l1QL3cVUCh93xSaua1N85qivl+siMkPGbO5xR/En4iEY6K2XPASUEMaieWVNTRCtJ4S8H+9`

const rsaKeys = [BITBUCKET_RSA_KEY, GITHUB_RSA_KEY, GITLAB_RSA_KEY]

async function run() {
  try {
    // Input
    const privateKey = getInput('private-key')

    // Save the private key
    await exec('mkdir -p ~/.ssh')
    await exec(`ls -la ~/.ssh`)
    await exec('echo', ['-e', privateKey, '>', '~/.ssh/id_rsa'])
    await exec(`ls -la ~/.ssh`)
    await exec(`echo -e ${privateKey} > ~/.ssh/id_rsa`)
    await exec(`ls -la ~/.ssh`)
    await exec(`PRIVATE_KEY="${privateKey}"`)
    await exec(`echo $PRIVATE_KEY > ~/.ssh/id_rsa`)
    await exec(`ls -la ~/.ssh`)
    await exec(`cat ~/.ssh/id_rsa`)
    console.log('Saved private key to ~/.ssh/id_rsa')
    await exec('chmod og-rwx ~/.ssh/id_rsa')

    // Prime the known_hosts
    await asyncForEach(
      rsaKeys,
      async rsaKey => await exec(`echo "${rsaKey}" >> ~/.ssh/known_hosts`)
    )

    // Output
    let publicKey = ''
    await exec('ssh-keygen -y -f ~/.ssh/id_rsa', [], {
      listeners: {
        stdout: data => (publicKey += data.toString())
      }
    })
    setOutput('public-key', publicKey)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
