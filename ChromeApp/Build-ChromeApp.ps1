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

# If the build directory exists, then recursively delete it.
if (Test-Path $buildDirectory) {
    Remove-Item -Recurse -Force $buildDirectory;
}

# Create build directory.
New-Item -Type Directory $buildDirectory

$appDirectory = Join-Path (Split-Path -parent $chromeAppDirectory) 'app';
Copy-Item -Recurse "$appDirectory\images\svg\" "$buildDirectory\images\svg\"
Copy-Item -Recurse "$appDirectory\styles", "$appDirectory\scripts" $buildDirectory;
Copy-Item "$appDirectory\images\icon_128.png" $buildDirectory
Copy-Item "$appDirectory\index.html" $buildDirectory

Copy-Item "$chromeAppDirectory\manifest.json", "$chromeAppDirectory\background.js" $buildDirectory;

#create the new target directory structures
$bowerDirectory = Join-Path $buildDirectory 'bower_components';
New-Item -Type Directory -Name ` 
    "$buildDirectory\jquery\dist\", `
    "$buildDirectory\bootstrap\dist\js\", `
    "$buildDirectory\bootstrap\dist\css\", `
    "$buildDirectory\accounting", `
    "$buildDirectory\knockout\build\output\";

#copy over the bower_components
Copy-Item "$appDirectory\jquery\dist\jquery.min.js" "$bowerDirectory\jquery\dist\jquery.min.js";
Copy-Item "$appDirectory\bootstrap\dist\js\bootstrap.min.js" "$bowerDirectory\bootstrap\dist\js\bootstrap.min.js";
Copy-Item "$appDirectory\accounting\accounting.min.js" "$bowerDirectory\accounting\accounting.min.js";
Copy-Item "$appDirectory\knockout\build\output\knockout-latest.debug.js" "$bowerDirectory\knockout\build\output\knockout-latest.debug.js";
Copy-Item "$appDirectory\bootstrap\dist\css\bootstrap.css" "$bowerDirectory\bootstrap\dist\css\bootstrap.css";

