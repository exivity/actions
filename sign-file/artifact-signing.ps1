<#
.SYNOPSIS
    Signs files with Azure Artifact Signing. Invoked by the sign-file action
    (method: artifact-signing). Authenticates with DefaultAzureCredential, so
    run azure/login (OIDC) earlier in the job; no signing secrets are needed.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Endpoint,
    [Parameter(Mandatory = $true)][string]$AccountName,
    [Parameter(Mandatory = $true)][string]$CertificateProfileName,
    [Parameter(Mandatory = $true)][string[]]$Files,
    [string]$Description = '',
    [string]$DescriptionUrl = ''
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Module -ListAvailable -Name ArtifactSigning)) {
    Write-Host 'Installing ArtifactSigning PowerShell module...'
    if (-not (Get-PackageProvider -Name NuGet -ErrorAction SilentlyContinue)) {
        Install-PackageProvider -Name NuGet -Force -Scope CurrentUser | Out-Null
    }
    Install-Module -Name ArtifactSigning -Force -Scope CurrentUser -AllowClobber
}
Import-Module ArtifactSigning

$params = @{
    Endpoint                           = $Endpoint
    CodeSigningAccountName             = $AccountName
    CertificateProfileName             = $CertificateProfileName
    Files                              = ($Files -join ',')
    FileDigest                         = 'SHA256'
    TimestampRfc3161                   = 'http://timestamp.acs.microsoft.com'
    TimestampDigest                    = 'SHA256'
    ExcludeInteractiveBrowserCredential = $true
    ExcludeVisualStudioCredential      = $true
    ExcludeVisualStudioCodeCredential  = $true
    ExcludeSharedTokenCacheCredential  = $true
    ExcludeAzurePowerShellCredential   = $true
    ExcludeAzureDeveloperCliCredential = $true
}
if ($Description) { $params.Description = $Description }
if ($DescriptionUrl) { $params.DescriptionUrl = $DescriptionUrl }

Write-Host "Signing $($Files.Count) file(s) with $AccountName/$CertificateProfileName"
Invoke-ArtifactSigning @params

foreach ($f in $Files) {
    $sig = Get-AuthenticodeSignature $f
    if ($sig.Status -ne 'Valid') {
        throw "Signature on $f is $($sig.Status): $($sig.StatusMessage)"
    }
    Write-Host "Signed $f as '$($sig.SignerCertificate.Subject)'"
}
