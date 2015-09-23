[![Build Status](https://secure.travis-ci.org/cogneco/magic.png?branch=master)](http://travis-ci.org/cogneco/magic)

**Table of Contents**

- [magic](#magic)
- [quick install (Linux)](#linux-quick-install)
- [very much readme](#very-much-readme)
- [requirements](#requirements)
  - [if you don't have node.js and/or the Typescript compiler](#if-you-dont-have-nodejs-andor-the-typescript-compiler)
- [installation](#installation)
  - [using the install script](#using-the-install-script)
  - [using the release](#using-the-release)
- [build](#build)
- [usage](#usage)
    - [ignore list](#ignore-list)
- [troubleshooting](#troubleshooting)
- [credits](#credits)

#magic

Code analyzer for the [ooc programming language](http://ooc-lang.org).

# Linux quick install
If you only want to use the release and won't bother with compiling anything yourself, this quick guide is for you.

## Install node 0.12 (Ubuntu)
[Taken from here (active as of september 2015)](https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories)

[If the first one doesn't do it for you, go here (active as of september 2015)](https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager)

* 1: Open up a terminal window
* 2: ```sudo apt-get update && sudo apt-get upgrade```
* 3: ```curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -```
* 4: ```sudo apt-get install -y nodejs```

## Install magic
* 1: [Download the latest release](https://github.com/cogneco/magic/releases) and unpack it to a location of your choosing
* 2: ```cd MAGIC_FOLDER```
* 3: ```sudo cp magic /usr/local/bin```

Done! Now head over to the [usage](#usage) section.

# very much readme
Very, very early alpha stage.
* The lexer must be improved and streamlined.
* A parse tree is yet to be implemented.
* The analyzer will work with a proper parse tree, once implemented.
This will enable more complex checks. Right now, a limited set of checks has been hacked together using the
token list generated from each file.
* A tab width of 4 is assumed.

# requirements
Known to work on Linux (x64), status on other platforms is unknown at this time.

* 1: g++ 4.2 or newer (node.js requirement)
* 2: [node.js](http://nodejs.org/)
* 3: [Typescript compiler](http://www.typescriptlang.org/) (if you want to build it yourself)

## if you don't have node.js and/or the Typescript compiler
First, install g++. Open up a terminal window and issue the following command, then follow the on-screen instructions.
```
sudo apt-get install g++
```

The node.js version provided by aptitude is outdated, so do not install via apt-get.
Instead, [download](https://nodejs.org/download/) and unpack node.js into any folder, then follow the steps outlined below.
```
cd NODE_FOLDER
./configure
make
sudo make install
```
You may have to restart the terminal. Now that we've installed node.js, it's time to update
npm (node package manager) and then install the Typescript compiler.
```
sudo npm install -g npm
```
```
sudo npm install -g typescript
```
Now verify that Typescript has been installed:
```
tsc --v
```
It should give you version 1.5.3 or greater.

# installation
You can install magic in two different ways:

* Using the provided install script
* Using the pre-compiled [release file](https://github.com/cogneco/magic/releases)

## using the install script
magic's default install location is ```/usr/local/bin```, which requires you to run the installer as root.
```
cd MAGIC_FOLDER
sudo ./install
```

If you want to install magic to a different location, you may give the installer that location as an argument.
Depending on the location, you may have to run the installer as root.

```./install ~/apps/bin```

The installer will build the project for you. For ease of use, make sure you have magic's location
in your ```$PATH```. To find out, issue the command ```echo $PATH``` in the terminal.

## using the release
* Download the [latest release](https://github.com/cogneco/magic/releases) and unpack it
* Move the file ```magic``` to a location of your choosing (we recommend ```/usr/local/bin``` or any other standard bin directory(this may require ```sudo```))
* That's it.

# build
If you have modified magic and want to rebuild it, make sure you're in magic's root folder,
then do one of the following:
* Compile directly: ```tsc```. The build output is located in ```./build```. To run magic, issue ```node ./build/magic.js TARGET_DIR```
* Run the installer: See [Using the install script](#using-the-install-script)

# usage
If you don't specify a target directory, your current location will be used.

```
magic [TARGET DIRECTORY]
```
```
magic ~/projects/my_awesome_project/source
```
* The target directory is processed recursively.
* The analyzer output (if any) is currently directed to the console.
For projects with a lot of violations, redirecting to a file is recommended.
```
magic ~/projects/my_awesome_project/source > violations.txt
```
If you want to run the analyzer on a single file, simply specify the filename.
You may also specify a list of files, separated by a space.
```
magic ~/projects/my_awesome_project/source/math/Quaternion.ooc
```
If your shell supports wildcard expansion, you may also specify wildcards to
process files that match a certain pattern, for example, to analyze all files that start with __Matrix__:
```
magic ~/projects/my_awesome_project/source/math/Matrix*.ooc
```
You may also sort the output of each file by line number, by using ```-s```
```
magic -s [TARGET]
```

### ignore list
If you want to prevent magic from analyzing certain folders or files in your project directory,
create a file called ```.magicignore``` and put it in the root folder of your project. In this file
you add everything you want to keep from magic, __relative to the project root folder__.

Example:
```
lib/somethirdpartylibrary
source/math/Transform.ooc
```

# troubleshooting
Here are some problems that may occur along the way, and hopefully, solutions to them.
* __I have installed magic, but can't seem to run it?__ Make sure the system knows where to look for it.
Try executing ```command -v magic```. The output should point to where magic is installed, if it is empty,
then you need to add magic's location to your ```$PATH```.

# credits
