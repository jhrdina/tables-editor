# Editor tabulek (ITU 2015/16) - Vývojové nástroje a zprovoznění

**Autoři:**

Štěpán Granát (xgrana02@stud.fit.vutbr.cz)
Jan Hrdina (xhrdin10@stud.fit.vutbr.cz)
Peter Gazdík (xgazdi03@stud.fit.vutbr.cz)

## Přehled
Při vývoji využíváme následující nástroje:

 - **node.js** - interpret a sada knihoven pro psaní desktopových aplikací v javascriptu
 - **npm** - správce balíčků pro node.js - umožňuje instalovat z internetu různé šikovné javascriptové aplikace, které je pak možné spouštět z příkazového řádku stejně jednoduše jako třeba vim.
 - **Bower** - node.js aplikace na správu závislostí - umožňuje jedním příkazem stáhnout všechny knihovny (jQuery, Polymer, ...) , které aplikace potřebuje a udržuje je aktuální
 - **Yeoman** - node.js aplikace na předgenerovávání zdrojáků. Usnadňuje počáteční vytvoření projektu a hlavně vytváření různých nových modulů, které člověk při vývoji potřebuje, např. `yo polymer:el mto-layers-switch` připraví soubory pro nový element.
 - **Gulp** - node.js task-runner, přes který, podobně jako make, spouští různé operace s projektem
 - **tsc** - kompilátor TypeScriptu, převádí soubory \*.ts na \*.js
 - **tsd** - správce definic pro TypeScript, umožní doinstalovat např. podporu typování (a tedy inteligentní našeptávání) pro jQuery a další knihovny.
 - **jshint** - nástroj pro statickou analýzu JavaScriptu
 - **svgo** - skvělá utilita na radikální zmenšení SVG souborů s obrázky

## První zprovoznění
### Instalace

Pro instalaci aktuálního npm by v Ubuntu by mělo stačit:

    curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
    sudo apt-get install --yes nodejs

Aby se aplikace npm instalovaly do domovského adresáře spíš než globálně do souborového systému, je nutné doplnit do `~/.bashrc`:

    export npm_config_prefix=~/.node_modules
    export NODE_PATH=$NODE_PATH:~/.node_modules/lib/node_modules
    export PATH=$PATH:~/.node_modules/bin

Všechno ostatní jsou nástroje, které se instalují přes npm. Parametr `-g` znamená, že se balíček instaluje "globálně", tedy nejen pro aktuální projekt.

    npm install -g yo gulp bower generator-polymer generator-polymerts yeoman-doctor tsc tsd jshint svgo

### Stažení součástí projektu

V čisté složce s projektem není prakticky žádný cizí kód. Žádné knihovny nebo něco podobného...

Ve složce s projektem stáhneme potřebné moduly příkazem

    npm install

Aktuální JS knihovny by mělo jít stáhnout příkazem

    bower install

Zdrojové kódy v TypeScriptu zkompilujeme do JavaScriptu příkazem

    tsc

To je všechno!

## Spuštění serveru

Vývojový server je možné spustit příkazem

    gulp serve

V terminálu se ukáže IP adresa a port, na kterém funguje a měl by se i otevřít v prohlížeči. Super je, že jakmile se uloží jakákoliv změna v projektu, stránka se automaticky obnoví.
