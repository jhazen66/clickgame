#
#  Build-ChromeApp.ps1
#  
#  Must be called from the project's root directory, due to the use of relative file paths.
#
#  This script handles the packaging for the Chome App version of this project.
#
Param(
    $chromeAppDirectory = (split-path -parent $MyInvocation.MyCommand.Definition),
    $buildDirectory = (Join-Path $chromeAppDirectory 'dist')
)
Trap [Exception] {
    Write-Host -ForegroundColor Red ("ERROR: (Message: {1})" -f $_.Exception.GetType().Name, $_.Exception.Message);
    Write-Host -ForegroundColor Red "`n`nBUILD FAILED!`n`n"
    Write-Host "Please correct errors and try again.";
    return
}

# If the build directory exists, then recursively delete it.
if (Test-Path $buildDirectory) {
    Remove-Item -Recurse -Force $buildDirectory;
    Write-Host -ForegroundColor Green "✔ Cleaning ChromeApp build directory `"$buildDirectory`"";
}

throw "ahahaha";

# Create build directory.
New-Item -Type Directory $buildDirectory
Write-Host -ForegroundColor Green "✔ Created new build directory `"$buildDirectory`"";

$appDirectory = Join-Path (Split-Path -parent $chromeAppDirectory) 'app';

Copy-Item -Recurse "$appDirectory\images\svg\" "$buildDirectory\images\svg\"
Copy-Item -Recurse "$appDirectory\styles", "$appDirectory\scripts" $buildDirectory;
Copy-Item "$appDirectory\images\icon_128.png" $buildDirectory
Copy-Item "$appDirectory\index.html" $buildDirectory

Copy-Item "$chromeAppDirectory\manifest.json", "$chromeAppDirectory\background.js" $buildDirectory;

# Copy-Item doesn't automatically create the needed folder structure, so the bower components
# files are first created as empty files, then copied.
$bowerComponents = @(
    'jquery\dist\jquery.min.js',
    'bootstrap\dist\js\bootstrap.min.js',
    'bootstrap\dist\css\bootstrap.css',
    'accounting\accounting.min.js',
    'knockout\build\output\knockout-latest.debug.js'
);

$bowerComponents | % {
    New-Item -Type File (Join-Path $buildDirectory $_) -Force | Out-Null;
    Copy-Item "$appDirectory\bower_components\$_" (Join-Path $buildDirectory $_) -Force | Out-Null;
}

Write-Host -ForegroundColor Green "✔ Copied files to build directory."

Write-Host -ForegroundColor Green "`n`nBUILD SUCCEEDED!`n`n";