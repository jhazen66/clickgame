#
#  demo.ps1
#  
#  This script copies files out of my local store a chunk at a time for the demo.
#  Rather than taking an input param it assumes the target repo is "webapp"
#

Param(
    $repoName = "webapp",
    $rootDirectory = (split-path -parent (split-path -parent $PSCommandPath)),
    $sourceDirectory = (split-path $PSCommandPath),
    $targetDirectory = (Join-Path $rootDirectory $repoName),

    [switch]$app = $false, 
    [switch]$chrome = $false, 
    [switch]$appx = $false,
    [switch]$debug = $false,
    [switch]$delete = $false       
)

if ($debug) {
    Write-Host -ForegroundColor Yellow "repoName `"$repoName`"";
    Write-Host -ForegroundColor Yellow "rootDirectory `"$rootDirectory`"";
    Write-Host -ForegroundColor Yellow "sourceDirectory `"$sourceDirectory`"";
    Write-Host -ForegroundColor Yellow "targetDirectory `"$targetDirectory`"";

    return;
}


# If the source directory does not exist, then error out
if (!(Test-Path -path $targetDirectory)) {
    Write-Host -ForegroundColor Red "- target repo not found `"$targetDirectory`"";

    return;
}

# This script helps work around the issue that the webapp folder that gets
# created has a folder structure that exceeds windows file path length limitations

if ($delete) {

    Write-Host -ForegroundColor Green "+ Starting to delete the webapp repo...";

    #create an empty directory
    New-Item -Type Directory "$rootDirectory\mt" | Out-Null;

    #call robocopy to copy the empty directory to the target, with the /MIR switch
    #which will sync the two, thus deleting the files in webapp.
    (robocopy "$rootDirectory\mt" "$rootDirectory\webapp" /MIR) | Out-Null;

    #delete the folders
    Remove-Item -Recurse -Force "$rootDirectory\mt" | Out-Null;
    Remove-Item -Recurse -Force "$targetDirectory" | Out-Null;

    Write-Host -ForegroundColor Green "+ Deleted the webapp repo `"$targetDirectory`"";
    return;
}


if ($app) {

    # Force Copy over the app files
    Copy-Item -Recurse (Join-Path $sourceDirectory 'app')  $targetDirectory -Force;
    Write-Host -ForegroundColor Green "+ Successfully Copied App Files";

    return;
}

if ($chrome) {

    # Force Copy over the Chrome App files
    Copy-Item -Recurse (Join-Path $sourceDirectory 'ChromeApp')  $targetDirectory -Force;
    Write-Host -ForegroundColor Green "+ Successfully Copied Chrome App Files";
    
    return;
}

if ($appx) {

    # Force Copy over the AppX files
    Copy-Item -Recurse (Join-Path $sourceDirectory 'appx')  $targetDirectory -Force;
    Write-Host -ForegroundColor Green "+ Successfully Copied AppX Files";
    
    return;
}


