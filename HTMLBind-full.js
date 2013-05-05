/*! html-bind - v0.0.1 - 2013-05-05
* Copyright (c) 2013 Itay Kinnrot; Licensed GNU */
!function(window,jQuery,undefined)
{
    window.kWatcher = window.kWatcher || function(scope ,config)
    {
        var dataBindString = "data-value";
        var watchers = {};
        var isWatching = false;
        var oldScope = {};
        var looperId = null;
        var watchAttr = {"kshow":"show","khide":"hide"};
        var dataBind = {};

        if (config)
        {
            for (var i in config)
            {
                if (i == "dataBindString")
                    dataBindString = config[i];
            }
        }
        //Private functions

        var saveOldScope = function(){
            for (var prop in scope)
            {
                if (scope.hasOwnProperty(prop))
                {
                    oldScope[prop] = scope[prop];
                }
            }
        }

        var isChanged = function()
        {
            var changed = false;
            for (var prop in scope)
            {
                if (scope.hasOwnProperty(prop))
                {

                    if (scope[prop] !== oldScope[prop])
                    {
                        changed = true;
                        if (watchers[prop])
                        {
                            for (var index=0; index<watchers[prop].length; index++)
                            {
                                watchers[prop][index](prop,oldScope[prop],scope[prop]);
                            }
                        }
                        if (dataBind[prop])
                        {
                            for (var i = 0 ; i < dataBind[prop].length ; i++)
                            {
                                var formatFunction = $(dataBind[prop][i]).attr("format");
                                var value = scope[prop];
                                if ( formatFunction && typeof scope[formatFunction] == "function")
                                {
                                    value = scope[formatFunction](value);
                                }
                                $(dataBind[prop][i]).text(value);
                            }
                        }
                    }
                }
            }
            return changed;
        }

        var bindData = function()
        {
            dataBind = {} ;
            var dataElements = jQuery("[" + dataBindString + "]");
            for (var i = 0 ; i < dataElements.length ; i++)
            {
                var element = dataElements[i];
                var dataBindValue = $(element).attr(dataBindString);
                if (dataBind[dataBindValue] || (dataBind[dataBindValue] = []))
                {
                    dataBind[dataBindValue].push( element ) ;

                }
            }

        }
        var updateUI =  function()
        {
            for (var attr in watchAttr)
            {

                var elements = jQuery("[" + attr + "]");
                for (var i=0;i<elements.length;i++)
                {
                    var element = elements[i];

                    var attributeValue =$(element).attr(attr);
                    //  console.log(attributeValue);
                    var logic = true;
                    if (attributeValue.indexOf("!") == 0)
                    {
                        attributeValue = attributeValue.split('!')[1];
                        logic = false;
                    }
                    var scopeValue = scope[attributeValue];
                    if ( typeof scopeValue == "function" )
                    {
                        scopeValue  =  scope[attributeValue]();
                    }
                    if (scope[attributeValue] == logic)
                    {
                        var method = watchAttr[attr];
                        console.log(method);
                        if (method)
                        {
                            jQuery(element)[method]();
                        }
                    }

                }
            }
        }


        ///public functions
        this.bind = function(prop,callback)
        {
            watchers[prop] || (watchers[prop] = []);
            watchers[prop].push(callback);

        }

        this.startWatch = function()
        {
            if (isWatching)
                return;
            isWatching = true;
            bindData();
            var looper = function(){
                if (isChanged())
                {
                    saveOldScope();
                    updateUI();

                }
                if (isWatching)
                {
                    looperId = setTimeout(looper,50);
                }
            }
            looper();
        }

        this.stopWatch = function()
        {
            isWatching = false;
            clearTimeout(looperId);
        }

        this.updateScope = function(newScope)
        {
            var needToWatch = false;
            if (isWatching)
            {
                this.stopWatch();
                needToWatch = true;
            }
            scope = newScope;
            oldScope = {};
            saveOldScope();

            if (needToWatch)
            {
                this.startWatch();
            }
        }

        this.setAttribute = function(attributeName,funcName)
        {
            watchAttr[attributeName] = funcName;

        }


        this.startWatch();
    }
}(window,jQuery);