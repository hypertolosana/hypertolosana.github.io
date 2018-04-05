08/28/2013
----------

* Modified Module definition 'extend' clause in favour of 'extendsClass'.
* Added optional.
* Fixed samples to show extendsClass call.


10/22/2012
----------

+ Added reentrant onReady functions.
+ Made the system able to load only javascript library files.



#MoMa - A Javascript Module and Class Manager.

MoMa (Module Manager) is a general dependency solver and symbol creator for javascript.
A module, ideally identifies one JavaScript file, and one symbol Class.
MoMa has the following features:

* Solves very deep transitive dependencies.
* Bundled files (all files concatenaded for production environments)
* Single file retrieval (get file by file for testing environments)
* Only javascript files loading
* Load Mixing of JavaScript file libraries and Modules loading
* Reentrant notification points.
* It does not pollute global namespace.
* Based on John Resig's Class pattern.

##MoMa.ModuleManager

The MoMa ModuleManager object is the entry point to modules definition. It is responsible for loading modules,
solving dependencies, notify callback observers about modules being solved, loading libraries, etc.

The ModuleManager will make dependencies on Class files, and not file names, making the loader a consistent Class
object and hierarchy manager. It is expected that one JavaScript module file will contain at least a symbol equal
to the module name.

MoMa.ModuleManager has the following functions:

###MoMa.ModuleManager.baseURL(path)

The base URL defines a document root to read and solve modules from.
The function will append **/** in case the path does not contain it.

###MoMa.ModuleManager.setModulePath(module, path)

Define as much module paths as needed. for example:

```javascript
MoMa.ModuleManager.setModulePath("CAAT.Foundation", "src/Foundation")
```

will make a module like

```javascript
MoMa.Module({
  defines : "CAAT.Foundation.UI.Label",
  ...
```

resolve to

```javascript
src/Foundation.UI.Label.
```

###MoMa.ModuleManager.bring( ["module1 | .js file", "module2 | .js file",...] )

This functions loads all the modules or libraries specified.
Modules are loaded and solved on the fly, while .js files, are simply loaded.
When **MoMa** ends loading and solving all files/modules, it notifies via callback to MoMa's **onReady** function.
**The onReady function, when invoked, will remove all onReady observers.**

This function loads a file if the array value ends with **js**, or tries to load a module otherwise.

###MoMa.ModuleManager.addModuleSolvedListener(modulename,callback)

Add a callback function when a given module has been solved.

###MoMa.ModuleManager.load(file, onload, onerror)

Load a js file, and notify callbacks on file load, or on error. This function does not try to solve any module
contained in the file.
Intended to load independant non-module files.

###MoMa.ModuleManager.onReady(callback)

Call the callback funtion when all the files specified by a call to bring have been loaded and solved. It is safe
to start any program from this callback function.

###MoMa.ModuleManager.status()

Get the ModuleManager status.
Dumps on console information about every loaded module, its pending dependencies, and whether it's been solved.
A module has been solved when recursively, all its dependencies have been loaded and solved.

###MoMa.ModuleManager.solvedInOrder()

Get the list in resolution order of the modules loaded by this ModuleManager.


##Module

A module identifies a JavaScript file, and ideally, defines a Class. It is uniquely identified by its **defines** clause.
There can be more than one module in a single file too.

A module is created by calling:

```javascript
MoMa.Module({
  defines : "a.qualified.class.name",
  aliases : ["qualified.name", "qualified.name", ... ],
  extendsClass : "a.qualified.class.name.to.extend",
  depends : ["a.qualified.class", "another.qualified.class", ... ],
  constants : {
    aconstant : 5,
    afunction : function() {
    },
    ...
  },
  extendsWith : function() {
    return {

    }
  },
  onCreate : function() {
    // function to call after module creation
    // opposed to when the module has been solved.
  }
}
```

###defines : {string}

This is the module definition. It must describe a valid constructor function namespace.
**MoMa** will build the needed object hierarchy from the global namespace and will synthesize a Class from the other
parameters to this name.

For example **defines : "CAAT.Foundation.Actor"** will create three nested objects CAAT -> Foundation -> Actor and will
associate the synthesized class to the **Actor** object.

###aliases : Array<string>

This allows to associate different class names.

For example **aliases: ["CAAT.Actor"]** will associate the same class object to CAAT.Foundation.Actor and CAAT.Actor.

This block is optional.

##depends : {Array<String>}

Define this module's dependencies. This clause could force new module resolution calls to bring the needed dependencies
to MoMa. Module resolution is instrumented by **setModulePath** calls.

This block is optional.

###constants : {object}

This clause will inject Class level constants.
By the time the module is defined, the Class has not yet been created, so Class level constants, as opposed to prototype
level constants can't be set. That's why, Class level constants have been deferred to a **constants** clause.

For example:

```javascript
CAAT.Module({
  defines : "CAAT.Module.Actor",
  constants : {
    c1: 1,
    c2: 'a'
  }
...
```

will create a final Class object:

```javascript
CAAT.Module.Actor.c1= 1
CAAT.Module.Actor.c2= 'a'
```

This block is optional.

###extendsClass : {string}

This block causes the synthesized class to extend the module Class identified by the string.
It must be a module either defined in the **depends** block, or already loaded by another module dependencies.

This block is optional.

###extendsWith : {function|object}

Extends the module Class' prototype defined in extends with this object.
If a function is especified as value, the function must return an object, which will be used as the extending prototype.
This is an inheritance pattern, where the base module is extended and a new Class object is created.


###decorated : {boolean}

Instrument the synthesized Class object to be decorated with closured __super methods.
See **Synthesized Class - A disgression on style.**


##Module resolution

The rules to load a module from a call to **bring** are the following:

 * if the module_name ends with **.js**
   * if starts with **/**, the module resolves to **module_name.substring(1)**
   * else the module resolves to **baseURL/module_name
 * else
   * if a suitable modulePath defined by a call to **setModulePath** exists
     * strip module_path prefix from module_name and change it by the associated path
     * change . by /
     * prepend **baseURL**
   * else return module_name, which **will probably fail**

For example:

```javascript
MoMa.ModuleManager.
  setBaseURL("/code/js").
  setModulePath( "CAAT.Foundation", "src/Foundation" );

MoMa.bring( [
    "CAAT.Foundation.Actor",
    "CAAT.Foundation.UI.Label",
    "a.js",
    "/a.js"
] );
```

**CAAT.Foundation.Actor** will resolve to:

```javascript
/code/js/src/Foundation/Actor.js
'/code/js/' + 'src/Foundation/' + 'Actor' + '.js'
```

**CAAT.Foundation.UI.Label** will resolve to:

```javascript
/code/js/src/Foundation/UI/Label.js
'/code/js/' + 'src/Foundation/' + 'UI/Label' + 'js'
```

**a.js** will resolve to:

```javascript
/code/js/a.js
'/code/js' + 'a.js'
```

**/a.js** will resolve to:

```javascript
a.js
```

##Synthesized Class - A disgression on style.

MoMa is based on John Resig's single inheritance pattern: http://ejohn.org/blog/simple-javascript-inheritance/

MoMa is the base Module Manager for CAAT, an animation library which aims at full speed. In the contrary to John
Resig's inheritance pattern, MoMa's implementation only builds a superclass closure for the initialization routine.
Despite being very convenient to have a symbol to point to the superclass' function implementation, it has shown to
be extremely slow, taking twice as much time calling using the closured superclass function that traversing the
object hierarchy.
In essence, for a base class's overriden method:

```javascript

Class a {
  function : method() {

  }
}

Class b extends a {
  function : method() {

  }
}

```

calling from b.method() to a.method(), with the closure sugarized version you'd issue a call like:

```javascript
Class b extends a {
  function : method() {
    this.__super();
  }
}
```

which is very handy, elegant and maintainable, but instead, a call like:

```javascript
Class b extends a {
  function : method() {
    b.superclass.a.call(this);
  }
}
```

will be executed, which is uglier, but extremely much faster.

A track for each synthesized class for **superclass** and **constructor** are being kept. So
**speed over maintainability can be chosen**.

On the other hand, a developer can specify **decorated : true** in the module definition, which will cause every
overriden method Class from the superclass to be using closured methods.

MoMa imposes an external initialization function for Object initialization during construction. A call to **new**
on any Class will cause a call to the optional **__init** method. This method is expected to hold all the initialization
process for a given Class. This is the only closured by default method, and the developer should call
**this.__super(arg1, arg2, ...)** to chain constructor calls.

##Example

These examples are from CAAT project: http://hyperandroid.github.com/CAAT

###MoMa.ModuleManager example.

```javascript
MoMa.ModuleManager.
    // set the loader base URL
        baseURL("src/").

    // set some resolution paths
        setModulePath("CAAT.Core",              "Core").
        setModulePath("CAAT.Math",              "Math").
        setModulePath("CAAT.Behavior",          "Behavior").
        setModulePath("CAAT.Foundation",        "Foundation").
        setModulePath("CAAT.Event",             "Event").
        setModulePath("CAAT.PathUtil",          "PathUtil").
        setModulePath("CAAT.Module",            "Modules").
        setModulePath("CAAT.Module.Preloader",  "Modules/Image/Preloader").
        setModulePath("CAAT.WebGL",             "WebGL").

    // get modules, and solve their dependencies.
    // MoMa will end up loading many more modules than these.
        bring(
        [
            "CAAT.PathUtil.Path",
            "CAAT.Foundation.Director",
            "CAAT.Foundation.Scene",
            "CAAT.Foundation.UI.PathActor",
            "CAAT.Foundation.UI.InterpolatorActor",
            "CAAT.Foundation.UI.TextActor",
            "CAAT.Foundation.UI.Dock",
            "CAAT.Module.Preloader.Preloader"
        ]).

    // this function will be fired after all modules have been loaded and all dependencies
    // have been solved.
    // it may imply loading other module files and solving its dependencies as well.
    // if you call bting again, this function could be re-fired.
        onReady(function () {

        });
```

###MoMa.Module example

This example assumes the module source files are located in a folder src/test.

```javascript
MoMa.Module({

    defines : "Test.A",
    extendsWith : {

        // initialization function is called from the constructor.
        __init : function( val ) {

            if ( typeof val!=="undefined" ) {
                this.val= val;
            }
        },

        val : "test.a value",

        getValue : function() {
            return this.val;
        }
    }

});
```

This will create a Class identified by **Test.A**.

This Module could be retrieved for example with:

```javascript
MoMa.ModuleManager.

    // assume Test.* files are under src/test folder
    setModulePath( "Test", "src/test" ).

    // load src/test/A.js file and define Test.A Class.
    bring("Test.A").

    // when
    onReady(function() {

        var v0= new Test.A();
        var v1= new Test.A("new value");

        v0.getValue();
        // "test.a value"

        v1.getValue();
        // "new value"
    });

```

###MoMa.Module Inheritance example

To extend the previous **Test.A** example with new behavior, do something like the following:

```javascript
MoMa.Module({
    defines : "Test.B",
    depends : [
        "Test.A"
    ],
    extendsClass : "Test.A",
    extendsWith : {
        __init : function( val, val2 ) {
            this.__super(val);
            this.val2= val2;
        },

        val2 : "Test.B value",

        getValue : function() {

            // to reference superclass's getValue method, you must traverse and know which superclass
            // has been defined for this class.
            // you can set decorated:true in the Module definition as in BDecorated.js example and
            // be able to access superclass method with this.__super().
            // despite being more convenient for maintainability purposes, it is twice slower than using
            // the superclass traversal.
            return "superValue=" + Test.B.superclass.getValue.call(this)+ " value=" + this.val2;
        }
    }
});

MoMa.ModuleManager.

    // assume Test.* files are under src/test folder
    setModulePath( "Test", "src/test" ).

    // load src/test/A.js file and define Test.A Class.
    bring([
        "Test.A",
        "Test.B"
    ]).

    // when
    onReady(function() {

        var va= new Test.A("value for Class a");
        var vb= new Test.B( "value for a", "value for b" );

        va.getValue();
        // "value for Class a"

        vb.getValue();
        // "superValue=value for Class a value=value for b"
    });

```

Also a call to:

```javascript
<some_object_created_with_MoMa>.extend( extendingProt, constants, name );
```

will immediately extend the symbol with a new prototype, constants, and will be placed in the global namespace under the
'name' parameter.