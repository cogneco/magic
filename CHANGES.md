**Table of Contents**
- [0.1.16-alpha](#0116-alpha)
- [0.1.15-alpha](#0115-alpha)
- [0.1.14-alpha](#0114-alpha)
- [0.1.13-alpha](#0113-alpha)
- [0.1.12-alpha](#0112-alpha)
- [0.1.11-alpha](#0111-alpha)
- [0.1.10-alpha](#0110-alpha)
- [0.1.9-alpha](#019-alpha)
- [0.1.8-alpha](#018-alpha)
- [0.1.7-alpha](#017-alpha)
- [0.1.6-alpha](#016-alpha)
- [0.1.5-alpha](#015-alpha)
- [0.1.4-alpha](#014-alpha)
- [0.1.3-alpha](#013-alpha)
- [0.1.2-alpha](#012-alpha)

# 0.1.16-alpha
* New rule: whitespace is not allowed between identifier and colon in a function definition

# 0.1.15-alpha
* fixed a bug where escape sequence within a char literal were not read correctly

# 0.1.14-alpha
* ```-s``` may now be used to sort violations by line location. ```magic -s [PATH]```
* re-enabled check for space between keyword 'class' and '<'
* Improved ThisUsage rule to disengage if it discovers two consecutive identifiers where both starting with a capital letter.
* Improved indent rule to contextualize the ```class``` keyword
* Improved checks for empty lines

# 0.1.13-alpha
* Implemented simple (limited) indentation rule
* Improved checks for tabs and spaces

# 0.1.12-alpha
* magic now returns 1 when violations are found

# 0.1.11-alpha
* Fixed a bug in redundant type info rule

# 0.1.10-alpha
* Fixed redundant type info rule so that it does not trigger when one or more of the arguments are pointers
* Improved separator spacing rule to trigger when a space is missing between ```)``` and ```{```
* Changed console colors

# 0.1.9-alpha
* Improved SeparatorSpacing to trigger if a space is missing before a ```}```, if the previous token is a literal, identifier or keyword.
* Added ```++``` (pre-increment operator) and removed it from the operator spacing rule.

# 0.1.8-alpha

* Improved SeparatorSpacing to act on tabs where a space was expected
* Fixed a bug in KeywordSpacing where ```func (class: foobar)``` would trigger a violation
* Fixed a bug in RedundantTypeInfo where it would react on function calls in addition to function signatures
* Improved SeparatorSpacing to check for space after ```{``` and after ```)``` if the parenthesis is followed by a ```}```
* Fixed OperatorSpacing so it reports if a tab was found instead of a space
* Fixed KeywordSpacing to handle cases like ```VectorList<This>``` without compaining about missing space

# 0.1.7-alpha
* Same as 0.1.6-alpha

# 0.1.6-alpha
* No change - only release mode changes

# 0.1.5-alpha
* Fixed EmptyLines rule to check for an empty line in the beginning of a file
* Fixed KeywordSpacing rule so it does not trigger a violation when a keyword is immediately followed by the ```?``` operator.
* Added ```:``` to the SeparatorSpacing rule.
* get/set are no longer considered by the KeywordSpacing rule

# 0.1.4-alpha
* fixed a bug in ThisUsage rule where it would stop analyzing the file if it came across ```cover from```
* improved EmptyLines rule to detect unnecessary empty line(s) before EOF, before closing curly and after opening curly.
* Command-line handling was improved. You can now target a specific file, a list of files or a directory,
and also use wildcards, if your shell support wildcard expansion.

# 0.1.3-alpha
* Implemented Semicolon rule, which says that no line can end with a semicolon.
Example:
```
x = 1; y = 2; z = 3 // Allowed
x = 1; y = 2; z = 3; // Not allowed
```
* fixed a bug in ThisUsage

# 0.1.2-alpha
* a lot of bug fixes
* fixed so .ooc~ files are ignored
* improved rules for checking for excessive whitespace
* the range operator ```..``` is now required to be surrounded by spaces
* new rule: ThisUsage, which says to use ```This``` instead of the class name
* varargs is now handled properly
* keywords ```extern, unmangled, get and set``` are now required to be surrounded by spaces
* covers are now targeted by the ThisUsage rule