# FastFlow
[![Build Status](https://travis-ci.org/FastFlowDebate/FastFlow.svg?branch=master)](https://travis-ci.org/FastFlowDebate/FastFlow)
[![Build status](https://ci.appveyor.com/api/projects/status/cg72fv9in3fe9gvk/branch/master?svg=true)](https://ci.appveyor.com/project/Zarkoix/fastflow/branch/master)
[![Dependancy Status](https://david-dm.org/FastFlowDebate/FastFlow.svg)](https://david-dm.org)

Debate organization suite for empowering debaters to directly leverage their research in round

## Current Features:

Cards:

* Searchable by author and sTags (searchable tags, not to be confused with a cards tag line)
* Organized by sTag in the card manager
* Add notes to cards
* Show what other files reference the card (For example do you use it in blocks or speeches)

Speeches:

* Write speeches in a simple, organized manner
* Mark speeches as aff or neg to make locating them easier

Flowing:

* Create organized flows
* Save and manage flows
* Mark individual cards as important you can easily refer to them in speeches

## Planned Features:

Speeches:

* Speech documents help you present by using telling you how long it would take to present, know exactly how much you can have in your rebuttal
* Every file you refer to is only one quick away, show your opponents evidence they request at lightspeed
* Spellcheck?
* Tell FastFlow how your speech should be preflowed as you write it


Blocks:

* Quickly select which responses you want to read in rebuttal and move them to a speech document or flow
* Mark responses as turns, delinks, mitigation, or indicts

Flowing:

* Add cards to your flow, and they'll automatically display the bolded text for easy reference
* Autocorrect taglines to streamline flowing
* [LONG TERM] Based on contention name allow you to one-click add your blocks to your flow

## Installation:
Make sure you have NodeJS installed

*in /fastflow*

    npm run setup

## Running

    npm run start

## Contribution

* Use the [Javascript Standard code style](https://github.com/feross/standard) for any and all JS development

* A branch will have to pass the build check (Travis-CI) before being considered for merge

* Update this README with any installation/building changes.
