#
#  Build-ChromeApp.ps1
#  
#  Must be called from the project's root directory, due to the use of relative file paths.
#
#  This script handles the packaging for the Chome App version of this project.
#

$projectDirectory = Get-Item .\;

$chromeDistDirectory = ('{0}\ChromeApp\dist\' -f $projectDirectory);

#clean the destination directory
Remove-Item -Recurse -Force ('{0}\*' -f $chromeDistDirectory);

#copy the required files
Copy-Item ('{0}\app\images\icon_128.png' -f $projectDirectory) ('{0}\icon_128.png' -f $chromeDistDirectory);
Copy-Item -recurse ('{0}\app\images\svg\' -f $projectDirectory) ('{0}\images\svg\' -f $chromeDistDirectory);
Copy-Item -recurse ('{0}\app\styles\' -f $projectDirectory) ('{0}\styles\' -f $chromeDistDirectory);
Copy-Item -recurse ('{0}\app\scripts\' -f $projectDirectory) ('{0}\scripts\' -f $chromeDistDirectory);
Copy-Item ('{0}\app\index.html' -f $projectDirectory) ('{0}\index.html' -f $chromeDistDirectory);
Copy-Item ('{0}\ChromeApp\manifest.json' -f $projectDirectory) ('{0}\' -f $chromeDistDirectory);
Copy-Item ('{0}\ChromeApp\background.js' -f $projectDirectory) ('{0}\' -f $chromeDistDirectory);

New-Item ('{0}\bower_components\' -f $chromeDistDirectory) -type directory; 
New-Item ('{0}\bower_components\jquery\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\jquery\dist\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\bootstrap\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\bootstrap\dist\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\bootstrap\dist\js\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\bootstrap\dist\css' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\accounting' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\knockout\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\knockout\build\' -f $chromeDistDirectory) -type directory;
New-Item ('{0}\bower_components\knockout\build\output\' -f $chromeDistDirectory) -type directory;

Copy-Item ('{0}\app\bower_components\jquery\dist\jquery.min.js' -f $projectDirectory) ('{0}\bower_components\jquery\dist\jquery.min.js' -f $chromeDistDirectory);
Copy-Item ('{0}\app\bower_components\bootstrap\dist\js\bootstrap.min.js' -f $projectDirectory) ('{0}\bower_components\bootstrap\dist\js\bootstrap.min.js' -f $chromeDistDirectory);
Copy-Item ('{0}\app\bower_components\accounting\accounting.min.js' -f $projectDirectory) ('{0}\bower_components\accounting\accounting.min.js' -f $chromeDistDirectory);
Copy-Item ('{0}\app\bower_components\knockout\build\output\knockout-latest.debug.js' -f $projectDirectory) ('{0}\bower_components\knockout\build\output\knockout-latest.debug.js' -f $chromeDistDirectory);
Copy-Item ('{0}\app\bower_components\bootstrap\dist\css\bootstrap.css' -f $projectDirectory) ('{0}\bower_components\bootstrap\dist\css\bootstrap.css' -f $chromeDistDirectory);

