ClickGame
=========

A simple javascript based click game
------------------------------------

Play it [here!](https://clickgame.azurewebsites.net)

**Current features:**

  1. click-to-earn - clicking the big round button allows a player to earn virtual game money
  2. click-to-buy - clicking on a button allows a player to buy an item, if they have enough money
  3. item-price-increase - when any item is purchased the price increases
  4. Save players inventory, virtual money, and clicks-per-second
  5. Ability to Reset Game
  6. Ability to cheat by getting free money
  7. Credits for for the great images from [The Noun Project](https://thenounproject.com)

**Future Improvements:**

  1. Achievements for clicking
  2. Game Statistics

**Tools and Libraries used:**

  1. [Yeoman](http://yeoman.io) - scaffolding for webapp
  2. [Bootstrap](http://getbootstrap.com/) - responsive layout
  3. [Knockout](http://knockoutjs.com/) - data binding
  4. [jQuery](http://jquery.com/) - because jquery
  3. [Accounting.js](http://josscrowcroft.github.io/accounting.js/) - formatting money values
  4. Also using the [Microsoft Software Development Kit (SDK) for Windows 8.1](http://msdn.microsoft.com/en-US/windows/desktop/bg162891) - needed makeapp.exe for creating the appx file for the Windows Store App package.

**Building Chrome Packaged App and Windows Store App**

In addition to supporting Internet Explorer 10+, Firefox, and Chrome, this project also has support for creating a Chrome Packaged App, and a Windows Store app.

*To install the project as an appx file on Windows:*

1. run `.\AppX\Build-AppX.ps1` from the root of the project.
2. this will package and install the appx file to your start menu

*To create the folder for the Chrome Packaged App:*

1. run `.\ChromeApp\Build-ChromeApp.ps1` from the root of the project.
2. Open Chrome and install the package from the .\ChromeApp\dist folder


**Oddities**

Since I did not have time to deal with [this issue](https://github.com/knockout/knockout/issues/1039) I am using the knockout-latest.debug.js rather than the properly built minified version.  A compromise that is ok for a demo, but not something you would want in production.


**Help me out**

Pull requests are most welcome...there is a lot I have not yet learned about Yeoman and grunt, and I am sure there are better ways of configuring the project and scripting the builds.  If there is a better way, help me fix it.

