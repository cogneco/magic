#magic

Code analyzer for [ooc](http://ooc-lang.org)

#very much readme
Very, very early alpha stage.
* The lexer must be improved and streamlined.
* A parse tree is yet to be implemented.
* The analyzer will work with a proper parse tree, once implemented.
This will enable more complex checks. Right now, a limited set of checks has been hacked together using the
token list generated from each file.
* Command line arguments are not implemented (except for -f).
* A tab width of 4 is assumed when calculating the column index in style violation warnings

#requirements
Known to work on Linux (x64), status on other platforms is unknown at this time.
__If you don't want to use the standalone release binary__, make sure you have a reasonably
new version of the following or follow the instructions in the next section.
* 1: [node.js](http://nodejs.org/)
* 2: [Typescript compiler](http://www.typescriptlang.org/)
* 3: [nexe](https://github.com/crcn/nexe) (if you want to compile a standalone binary)

##If you don't have node.js and the Typescript compiler
The node.js version provided by aptitude is outdated, so do not install via apt-get.
Instead, download and unpack node.js into any folder, then follow the steps outlined below.
```
cd NODE_FOLDER
./configure
make
make install
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

#shell scripts
* ```build_magic``` builds magic, output in ./build/
* ```clean_magic``` removes ./build/
* ```magic``` magic app entry point
* ```build_release``` builds magic and creates a standalone binary in ./release/ (requires [nexe](https://github.com/crcn/nexe))

#build
Build the project: ```./build_magic```
You can safely ignore these errors:
```
typings/node/node.d.ts(212,21): error TS2304: Cannot find name 'Map'.
typings/node/node.d.ts(221,21): error TS2304: Cannot find name 'Set'.
typings/node/node.d.ts(231,25): error TS2304: Cannot find name 'WeakMap'.
```

#usage
If you don't specify a target directory, your current location will be used.

```
./magic [TARGET DIRECTORY]
```
```
./magic ~/projects/my_awesome_project/source
```
* The target directory is processed recursively.
* The analyzer output (if any) is currently directed to the console. For projects
with a lot of violations, redirecting to a file is recommended.
```
./magic ~/projects/my_awesome_project/source > violations.txt
```
If you want to run the analyzer on a single file, use __-f__ (this does not work with the binary yet)
```
./magic -f ~/projects/my_awesome_project/source/math/Quaternion.ooc
```

###ignore list
If you want to prevent magic from analyzing certain folders or files in your project directory,
create a file called ```.magicignore``` and put it in the root folder of your project. In this file
you add everything you want to keep from magic, __relative to the project root folder__.

Example:
```
lib/somethirdpartylibrary
source/math/Transform.ooc
```

#troubleshooting
Here are some problems that may occur along the way, and hopefully, solutions to them.

##using the binary
__Problem__: You get this error when trying to run the binary:
```
./magic: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `GLIBCXX_3.4.20' not found (required by ./magic)_
```
__Why?__ Node.js was probably compiled using a newer version of gcc/g++.

__Solution 1__ (Ubuntu 14.04): Install g++ 4.9 (or newer):
```
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install g++-4.9
```
If you installed g++ 4.9 from the specified PPA, your default g++ version will not
be altered. If you don't want to keep the newly added toolchain PPA, issue this command:
```
sudo add-apt-repository --remove ppa:ubuntu-toolchain-r/test
```

# credits
