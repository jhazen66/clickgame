#
#  Build-ChromeApp.ps1
#  
#  This script handles the packaging for the Chome App version of this project.
#
Param(
    $chromeAppDirectory = (split-path -parent $MyInvocation.MyCommand.Definition),
    $buildDirectory = (Join-Path $chromeAppDirectory 'dist')
)
Trap [Exception] {
    Write-Host -ForegroundColor Red ("ERROR: {0} (Message: {1})" -f $_.Exception.GetType().Name, $_.Exception.Message);
    Write-Host -ForegroundColor Red "`n`nBUILD FAILED!`n`n"
    Write-Host "Please correct errors and try again.";
    return
}

Set-Alias -Name chrome -Value ('{0}\Google\Chrome\Application\chrome.exe' -f ${env:ProgramFiles(x86)});

# If the build directory exists, then recursively delete it.
if (Test-Path $buildDirectory) {
    Remove-Item -Recurse -Force $buildDirectory;
    Write-Host -ForegroundColor Green "+ Cleaning ChromeApp build directory `"$buildDirectory`"";
}

# Create build directory.
New-Item -Type Directory $buildDirectory | Out-Null;
Write-Host -ForegroundColor Green "+ Created new build directory `"$buildDirectory`"";

$appDirectory = Join-Path (Split-Path -parent $chromeAppDirectory) 'app';

Copy-Item -Recurse "$appDirectory\images\svg\" "$buildDirectory\images\svg\"
Copy-Item -Recurse "$appDirectory\styles", "$appDirectory\scripts" $buildDirectory;
Copy-Item "$appDirectory\images\icon_128.png" $buildDirectory
Copy-Item "$appDirectory\index.html" $buildDirectory

Copy-Item "$chromeAppDirectory\manifest.json", "$chromeAppDirectory\background.js" $buildDirectory;

# Copy-Item doesn't automatically create the needed folder structure, so the bower components
# files are first created as empty files, then copied.
$bowerComponents = @(
    'bower_components\jquery\dist\jquery.min.js',
    'bower_components\bootstrap\dist\js\bootstrap.min.js',
    'bower_components\bootstrap\dist\css\bootstrap.css',
    'bower_components\accounting\accounting.min.js',
    'bower_components\knockout\build\output\knockout-latest.debug.js'
);

$bowerComponents | % {
    New-Item -Type File (Join-Path $buildDirectory $_) -Force | Out-Null;
    Copy-Item "$appDirectory\$_" "$buildDirectory\$_" -Force | Out-Null;
}

Write-Host -ForegroundColor Green "+ Copied files to build directory."
Write-Host -ForegroundColor Green "`n`nBUILD SUCCEEDED!`n`n";

chrome --load-and-launch-app="$buildDirectory" 