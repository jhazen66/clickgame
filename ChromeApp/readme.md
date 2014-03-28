# **Building the Chrome Packaged App** #

The process here is simply to gather all the right files, together with the proper manifest file and the required icon.  Then in Chrome you can install or package the app using the process described [here](https://developer.chrome.com/apps/first_app).

##Build-ChromeApp.ps1##

The script first clears out the dist folder, then copies all the right files into place.

## Required Files in this folder ##

The following files are included in this folder in addition to the sources we use from the main app folder.  These are specific to Chrome Packaged Apps.

- **background.js** the most basic backgound script for launching the app
- **manifest.json** the minimum basic manifest to define the app. 

## Notes ##

The manifest puts index.html into the sandbox.  This is because knockout.js makes use of eval, and eval is not allowed in Chrome Packaged Apps.  Read more about this [here](https://developer.chrome.com/extensions/sandboxingEval).  