/*!
 * jQuery JavaScript Library v1.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://docs.jquery.com/License
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 * 先读1.4的源代码吧, 也可以看看JS这几年的变化,有空去看prototype;
 * Date: Wed Jan 13 15:23:05 2010 -0500
 * jQ中正则的资料 ： http://www.jmrware.com/articles/2010/jqueryregex/jQueryRegexes.html
 * 工具方法;
 * 浏览器判断;
 * 浏览器支持;
 * 数据缓存, 数据队列;
 * class操作;
 * 事件系统;
 * sizzle;
 * 元素选择的操作(节点过滤,节点周围元素选择);
 * DOM节点的操作和DOM节点之间的相互操作;
 */
(function( window, undefined ) {

// Define a local copy of jQuery
    var jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init( selector, context );
        },

    //保存原来window.jQuery和window.$的数据，避免被重写;
    // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
        _$ = window.$,
    /*
     * 1.传入window
     * 通过传入window变量,使得window由全局变量变为局部变量
     * 当在jQuery代码块中访问window时,不需要将作用域链回退到顶层作用域,这样可以更快的访问window
     * 更重要的是,将window作为参数传入,可以在压缩代码时进行优化
     * (function(a,b){})(window);window 被优化为 a,压缩后文件更小
     * 2.传入undefined
     * 是为了在"自调用匿名函数"的作用域内,确信undefined是真的未定义
     * 因为undefined能够被重写,赋予新的值 
     * undefined = "now it's defined";
     * alert( undefined );
     * 浏览器测试结果:
     * ------------+----------------------+-------------
     *   浏览器       |    测试结果          |   结论
     *   ie           |    now it's defined  |   可以改变
     *   firefox   |    undefined          |   不能改变
     *   chrome       |    now it's defined  |   可以改变
     *   opera       |    now it's defined  |   可以改变
     * ------------+----------------------+-------------
     */
    //所有的API东西都是在window下的，直接从window下获取，提高查询的效率;
    // Use the correct document accordingly with window argument (sandbox)
        document = window.document,

    // A central reference to the root jQuery(document)
        rootjQuery,

    // A simple way to check for HTML strings or ID strings
    // (both of which we optimize for)
    // ^[^<]匹配非<开头 
    // (<[\w\W]+>) 匹配闭合的标签;
    // [^>]* 非右尖括号的字符,
    // 或者#([\w-]+)匹配ID;
        quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

    // Is it a simple selector
    //匹配开头是.的字符串, 这个就是匹配class;
        isSimple = /^.[^:#\[\.,]*$/,

    /*
     *匹配非空白字符,匹配[^ \f\n\r\t\v];
     *" "\f换页附 \n换行 \r回车 \t制表符 \v垂直制表符;
     */
    // Check if a string has a non-whitespace character in it
        rnotwhite = /\S/,

    // Used for trimming whitespace
    //匹配开头或者结尾的空格; \u00A0是全角的空格;
        rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,

    // Match a standalone tag
    // 匹配闭合标签或者是单个标签
    // ^<(\w+)\s*\/?> 开头是<,(\w)+至少一个字符串,\s*有或者没有空格,> 闭合标签
    // ?:<\/\1>? 可以匹配到或者匹配不到都行
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

    // Keep a UserAgent string for use with jQuery.browser
        userAgent = navigator.userAgent,

    // For matching the engine and version of the browser
        browserMatch,

    //文档是否加载完毕的标识符;
    // Has the ready events already been bound?
        readyBound = false,

    //DOM加载完毕的执行的函数列表;
    // The functions to execute on DOM ready
        readyList = [],

    //这个闭包内的全局变量;
    // The ready event handler
        DOMContentLoaded,

    // Save a reference to some core methods
    //简写, 这样就不用写一大串东东了;
        toString = Object.prototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        indexOf = Array.prototype.indexOf;

    jQuery.fn = jQuery.prototype = {
        //在高版本有个constructor指向Query自己;
        //这个constructor为Object;

        //jQ1.8的第三个参数为 rootjQuery;
        init: function( selector, context ) {
            var match, elem, ret, doc;

            // Handle $(""), $(null), or $(undefined)
            // or  $(false);
            if ( !selector ) {
                return this;
            }

            // Handle $(DOMElement)
            if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }

            // Handle HTML strings
            if ( typeof selector === "string" ) {
                // Are we dealing with HTML string or an ID?
                // quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,
                match = quickExpr.exec( selector );
                //debugger;
                //$("<div></div>") ==>> ["<div></div>", "<div></div>", undefined];
                //$("#div1") ==>> ["#div1", undefined, "div1"];
                // Verify a match, and that no context was specified for #id
                //匹配到东西  
                //match[1]有东西说明了是新建的匹配到了
                //没有上下文说明是匹配到ID的, 也会走进来;
                if ( match && (match[1] || !context) ) {

                    // HANDLE: $(html) -> $(array)
                    //新建元素;
                    if ( match[1] ) {
                        //指定文档,可能存在跨文档的情况;
                        doc = (context ? context.ownerDocument || context : document);

                        // If a single string is passed in and it's a single tag
                        // just do a createElement and skip the rest
                        ///^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                        ret = rsingleTag.exec( selector );

                        if ( ret ) {
                            //$("<div>",{xx:1, yy:2});
                            if ( jQuery.isPlainObject( context ) ) {
                                selector = [ document.createElement( ret[1] ) ];
                                jQuery.fn.attr.call( selector, context, true );

                            } else {
                                //直接创建标签名;
                                selector = [ doc.createElement( ret[1] ) ];
                            }

                        } else {
                            //用匹配的内容生成元素;
                            ret = buildFragment( [ match[1] ], [ doc ] );

                            //对返回的数据进行处理;
                            selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
                        };

                        // HANDLE: $("#id")
                    } else {
                        //匹配到ID了;
                        elem = document.getElementById( match[2] );

                        if ( elem ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            //ie6,7的的name和id一样的话,而且name的元素在前面, 会找到name的节点;
                            if ( elem.id !== match[2] ) {
                                //用sizzle跑就不会出问题了;
                                return rootjQuery.find( selector );
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $("TAG")
                    //匹配标签名, 上下问为document;
                } else if ( !context && /^\w+$/.test( selector ) ) {
                    this.selector = selector;
                    this.context = document;
                    selector = document.getElementsByTagName( selector );

                    // HANDLE: $(expr, $(...))
                } else if ( !context || context.jquery ) {
                    return (context || rootjQuery).find( selector );

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                    //反正是把所有的情况匹配了个遍;
                } else {
                    return jQuery( context ).find( selector );
                }

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if ( jQuery.isFunction( selector ) ) {
                return rootjQuery.ready( selector );
            }

            //统一处理,新建节点 等 没有返回的元素;
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            };
            //$("<div>sdfsdf</div>") ==>> $("<div>sdfsdf</div>")
            //转化成jQ数组
            return jQuery.isArray( selector ) ?
                this.setArray( selector ) :
                jQuery.makeArray( selector, this );
        },

        // Start with an empty selector
        //这个selector是在原型上的;
        selector: "",

        // The current version of jQuery being used
        jquery: "1.4",

        //也是原型上的,会被重写的;
        // The default length of a jQuery object is 0
        length: 0,

        // The number of elements contained in the matched element set
        size: function() {
            return this.length;
        },

        //通过slice转化成纯数组;
        toArray: function() {
            return slice.call( this, 0 );
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {
            return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                ( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        // $(el).pushStack("#idid")返回找到的元素,原来的el保存到prevObject里面了;
        pushStack: function( elems, name, selector ) {
            // Build a new jQuery matched element set
            var ret = jQuery( elems || null );
            //debugger;
            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            ret.context = this.context;

            if ( name === "find" ) {
                ret.selector = this.selector + (this.selector ? " " : "") + selector;
            } else if ( name ) {
                //div.slice();
                //div.slice(0,4);
                ret.selector = this.selector + "." + name + "(" + selector + ")";
            }

            // Return the newly-formed element set
            return ret;
        },

        // Force the current matched set of elements to become
        // the specified array of elements (destroying the stack in the process)
        // You should use pushStack() in order to do this, but maintain the stack
        //强制设置当前对象的元素为elems;
        setArray: function( elems ) {
            // Resetting the length to 0, then using the native Array push
            // is a super-fast way to populate an object with array-like properties
            this.length = 0;
            push.apply( this, elems );

            return this;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        //调用工具方法, 有第二个参数args;
        each: function( callback, args ) {
            return jQuery.each( this, callback, args );
        },

        ready: function( fn ) {
            // Attach the listeners
            jQuery.bindReady();

            // If the DOM is already ready
            if ( jQuery.isReady ) {
                // Execute the function immediately
                fn.call( document, jQuery );

                // Otherwise, remember the function for later
            } else if ( readyList ) {
                // Add the function to the wait list
                readyList.push( fn );
            }

            return this;
        },

        eq: function( i ) {
            return i === -1 ?
                this.slice( i ) :
                this.slice( i, +i + 1 );
        },

        first: function() {
            return this.eq( 0 );
        },

        last: function() {
            return this.eq( -1 );
        },

        slice: function() {
            //感觉pushStack的第三个参数没啥用;
            return this.pushStack( slice.apply( this, arguments ),
                "slice", slice.call(arguments).join(",") );
        },

        map: function( callback ) {
            //迭代this, 返回新的this;
            return this.pushStack( jQuery.map(this, function( elem, i ) {
                return callback.call( elem, i, elem );
            }));
        },

        end: function() {
            return this.prevObject || jQuery(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: [].sort,
        splice: [].splice
    };

// Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

//jQuery中的继承的方法, 复制继承;
    jQuery.extend = jQuery.fn.extend = function() {
        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        //如果是jQuery.extend就继承到jQuery上面去,
        //如果是jQuery.fn.extend就继承到jQuery.fn上面去;
        if ( length === i ) {
            target = this;
            --i;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }
                    //深度继承, 如果源对象上没有就用新建对象;
                    //然后重新跑深度继承;
                    // Recurse if we're merging object literal values or arrays
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || jQuery.isArray(copy) ) ) {
                        var clone = src && ( jQuery.isPlainObject(src) || jQuery.isArray(src) ) ? src
                            : jQuery.isArray(copy) ? [] : {};

                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        //基本的对象number, string, boolean就复制 , object就赋址;
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        //
        noConflict: function( deep ) {
            window.$ = _$;

            if ( deep ) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,


        //document绑定了事件, 如果到时间的话就会走ready;
        // Handle when the DOM is ready
        ready: function() {
            //没执行过的话
            // Make sure that the DOM is not already loaded
            if ( !jQuery.isReady ) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                //如果在body还没加载完毕就执行$.ready()就延迟一点在执行这个函数;
                if ( !document.body ) {
                    return setTimeout( jQuery.ready, 13 );
                }

                // Remember that the DOM is ready
                jQuery.isReady = true;

                // If there are functions bound, to execute
                if ( readyList ) {
                    // Execute all of them
                    var fn, i = 0;
                    //逐个执行;
                    while ( (fn = readyList[ i++ ]) ) {
                        fn.call( document, jQuery );
                    }

                    // Reset the list of functions
                    readyList = null;
                }

                //可以为dom添加自定义事件;
                // Trigger any bound ready events
                if ( jQuery.fn.triggerHandler ) {
                    jQuery( document ).triggerHandler( "ready" );
                }
            }
        },

        bindReady: function() {
            if ( readyBound ) {
                return;
            }

            readyBound = true;

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            //DOM的加载已经执行过一次了.
            if ( document.readyState === "complete" ) {
                return jQuery.ready();
            };

            //标准浏览器的事件绑定
            // Mozilla, Opera and webkit nightlies currently support this event
            if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                // A fallback to window.onload, that will always work
                window.addEventListener( "load", jQuery.ready, false );

                // If IE event model is used
            } else if ( document.attachEvent ) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                //IE下的任何需要访问网络的元素都有onreadystatechange事件;
                document.attachEvent("onreadystatechange", DOMContentLoaded);

                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", jQuery.ready );

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;
                //window.frameElement 是什么?
                //form http://blog.csdn.net/fudesign2008/article/details/6075055;
                //is the element which the window is embedded into, or  null   if the window is top-level.
                try {
                    toplevel = window.frameElement == null;
                } catch(e) {}

                if ( document.documentElement.doScroll && toplevel ) {
                    doScrollCheck();
                    //IE的hack, 成功了也会调用jQuery.ready;
                };

            }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        //http://bugs.jquery.com/attachment/ticket/2968/2968.diff没懂，用qunit跑的;
        isFunction: function( obj ) {
            return toString.call(obj) === "[object Function]";
        },

        isArray: function( obj ) {
            return toString.call(obj) === "[object Array]";
        },

        isPlainObject: function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            //这个是必须的                                        //节点属性         //window;
            if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
                return false;
            }

            // Not own constructor property must be Object
            //避免报错
            if ( obj.constructor
                //还要测试这个..
                && !hasOwnProperty.call(obj, "constructor")
                //和这个
                && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for ( key in obj ) {}
            //没有任何可以遍历的属性   
            //如果有属性,这个属性也要是自己的属性;
            return key === undefined || hasOwnProperty.call( obj, key );
        },

        //纯空的对象;
        isEmptyObject: function( obj ) {
            for ( var name in obj ) {
                return false;
            }
            return true;
        },


        noop: function() {},


        // Evalulates a script in a global context
        globalEval: function( data ) {
            /*rnotwhite是什么;非纯空格的空格;
             *匹配非空白字符,匹配[^ \f\n\r\t\v];
             *" "\f换页附 \n换行 \r回车 \t制表符 \v垂直制表符;
             */
            // Check if a string has a non-whitespace character in it
            rnotwhite = /\S/;
            if ( data && rnotwhite.test(data) ) {
                // Inspired by code by Andrea Giammarchi
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                script.type = "text/javascript";

                if ( jQuery.support.scriptEval ) {
                    script.appendChild( document.createTextNode( data ) );
                } else {
                    script.text = data;
                }

                // Use insertBefore instead of appendChild to circumvent an IE6 bug.
                // This arises when a base node is used (#2709).
                head.insertBefore( script, head.firstChild );
                head.removeChild( script );
            }
            /*
             TODO: 如果直接eval可行吗?
             (1,eval)(data)?
             */
        },

        //$.fn.nodeName = function() { $.nodeName.apply( elem,slice(arguments) ); };
        nodeName: function( elem, name ) {
            return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
        },

        //
        // args is for internal usage only
        ////$.fn.each = function(callback) { $.each( this.slice(),  callback) };
        each: function( object, callback, args ) {
            var name, i = 0,
                length = object.length,
                isObj = length === undefined || jQuery.isFunction(object);
            //args是提供内部使用的, 我想这东西哪里用到了;
            if ( args ) {
                if ( isObj ) {
                    for ( name in object ) {
                        if ( callback.apply( object[ name ], args ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( ; i < length; ) {
                        if ( callback.apply( object[ i++ ], args ) === false ) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if ( isObj ) {
                    for ( name in object ) {
                        if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( var value = object[0];
                          i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
                }
            }

            return object;
        },

        trim: function( text ) {
            return (text || "").replace( rtrim, "" );
        },

        // results is for internal usage only
        /*
         $.makeArray({0:1,1:3,length:2})
         [1, 3]
         */
        makeArray: function( array, results ) {
            var ret = results || [];

            if ( array != null ) {
                // The window, strings (and functions) also have 'length'
                // The extra typeof function check is to prevent crashes
                // in Safari 2 (See: #3039)
                if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
                    push.call( ret, array );
                } else {
                    jQuery.merge( ret, array );
                }
            }

            return ret;
        },

        inArray: function( elem, array ) {
            //多数都有indexOf这方法;
            if ( array.indexOf ) {
                return array.indexOf( elem );
            }

            //可以遍历类数组;
            for ( var i = 0, length = array.length; i < length; i++ ) {
                if ( array[ i ] === elem ) {
                    return i;
                }
            }

            //跟默认的一样
            return -1;
        },

        //merge数组或对象到第一个参数, 我不会说这个东西跟extend差不多;
        merge: function( first, second ) {
            var i = first.length, j = 0;

            if ( typeof second.length === "number" ) {
                for ( var l = second.length; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }
            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }

            //修正length;
            first.length = i;

            return first;
        },

        //可以遍历类数组, 
        //inv 默认就是undefined
        grep: function( elems, callback, inv ) {
            var ret = [];

            // Go through the array, only saving the items
            // that pass the validator function
            for ( var i = 0, length = elems.length; i < length; i++ ) {
                //!inv === true; 如果callback返回true; 者ture !== ture为真;
                //元素, index; 顺序和原生的Array.filter一摸一样;
                if ( !inv !== !callback( elems[ i ], i ) ) {
                    ret.push( elems[ i ] );
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function( elems, callback, arg ) {
            var ret = [], value;

            // Go through the array, translating each of the items to their
            // new value (or values).
            for ( var i = 0, length = elems.length; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );
                // 不等于null 和 undefined;
                if ( value != null ) {
                    //相当于ret.push( value );
                    ret[ ret.length ] = value;
                }
            }
            //flaten, 扁平化;
            /*
             [].concat.apply([],[0,1,2,[3,4]])
             [0, 1, 2, 3, 4]
             */
            return ret.concat.apply( [], ret );
        },

        // A global GUID counter for objects
        guid: 1,
        //$.proxy( function(){console.log(this)}, document.body)()
        proxy: function( fn, proxy, thisObject ) {
            //修正参数;
            //如果参数只有两个;
            if ( arguments.length === 2 ) {
                //调用第一个对象的的方法;
                //$.proxy( { a : function(){console.log(this)}},"a" )()
                if ( typeof proxy === "string" ) {
                    thisObject = fn;
                    fn = thisObject[ proxy ];
                    proxy = undefined;

                    //proxy不是函数的话;
                    //$.proxy( function(){console.log(this)}, $)(); 意思就是如果你用$或者$.proxy作为上下文是不行的）——（函数怎么可能是上下文..
                } else if ( proxy && !jQuery.isFunction( proxy ) ) {
                    thisObject = proxy;
                    proxy = undefined;
                }
            };

            //没有proxy的话, 应该就只有fn了;
            if ( !proxy && fn ) {
                //直接用this作为这个context
                proxy = function() {
                    return fn.apply( thisObject || this, arguments );
                };
            }

            //proxy的第二个参数其实没啥用, 如果有传proxy就是把fn的guid给proxy的guid;
            //设置guid, 相当于一个标识;
            // Set the guid of unique handler to the same of original handler, so it can be removed
            if ( fn ) {
                proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
            }

            // So proxy can be declared as an argument
            return proxy;
        },

        // Use of jQuery.browser is frowned upon.
        // More details: http://docs.jquery.com/Utilities/jQuery.browser
        //line 840 把 userAgent传进来了;
        uaMatch: function( ua ) {
            var ret = { browser: "" };

            ua = ua.toLowerCase();

            if ( /webkit/.test( ua ) ) {
                ret = { browser: "webkit", version: /webkit[\/ ]([\w.]+)/ };

            } else if ( /opera/.test( ua ) ) {
                ret = { browser: "opera", version:  /version/.test( ua ) ? /version[\/ ]([\w.]+)/ : /opera[\/ ]([\w.]+)/ };

            } else if ( /msie/.test( ua ) ) {
                ret = { browser: "msie", version: /msie ([\w.]+)/ };

            } else if ( /mozilla/.test( ua ) && !/compatible/.test( ua ) ) {
                ret = { browser: "mozilla", version: /rv:([\w.]+)/ };
            }

            ret.version = (ret.version && ret.version.exec( ua ) || [0, "0"])[1];

            return ret;
        },

        browser: {}
    });

    browserMatch = jQuery.uaMatch( userAgent );
//可能有别的没匹配到的;
    if ( browserMatch.browser ) {
        jQuery.browser[ browserMatch.browser ] = true;
        jQuery.browser.version = browserMatch.version;
    }

// Deprecated, use jQuery.browser.webkit instead
    if ( jQuery.browser.webkit ) {
        jQuery.browser.safari = true;
        //有必要加一个
        jQuery.browser.blink = true;
    }

//如果array的原型下有indexOf方法， 一般都有的;
    if ( indexOf ) {
        jQuery.inArray = function( elem, array ) {
            return indexOf.call( array, elem );
        };
    }

// All jQuery objects should point back to these
    rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
//标准浏览器的方法
    if ( document.addEventListener ) {
        DOMContentLoaded = function() {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            jQuery.ready();
        };

//IE下的绑定事件
    } else if ( document.attachEvent ) {
        DOMContentLoaded = function() {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", DOMContentLoaded );
                jQuery.ready();
            };
        };
    };

// The DOM ready check for Internet Explorer
//只是做IE的加载检测的hack;
    function doScrollCheck() {
        if ( jQuery.isReady ) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch( error ) {
            setTimeout( doScrollCheck, 1 );
            return;
        }

        // and execute any waiting functions
        jQuery.ready();
    }

    if ( indexOf ) {
        jQuery.inArray = function( elem, array ) {
            return indexOf.call( array, elem );
        };
    };

//谁懂这个i是拿来干嘛用的
    function evalScript( i, elem ) {
        //如果是地址类型;
        if ( elem.src ) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        } else {
            //如果这个是生成出来的标签, 把这个标签的内容eval出来;
            jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
        };

        if ( elem.parentNode ) {
            elem.parentNode.removeChild( elem );
        };
    };

//为了减少代码量, 用了一个access作为中间件;
// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
    function access( elems, key, value, exec, fn, pass ) {
        var length = elems.length;

        // Setting many attributes
        if ( typeof key === "object" ) {
            for ( var k in key ) {
                access( elems, k, key[k], exec, fn, value );
            }
            return elems;
        }

        // Setting one attribute
        if ( value !== undefined ) {
            // Optionally, function values get executed if exec is true
            exec = !pass && exec && jQuery.isFunction(value);

            for ( var i = 0; i < length; i++ ) {
                fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
            }

            return elems;
        }

        // Getting an attribute
        return length ? fn( elems[0], key ) : null;
    };

    function now() {
        return (new Date).getTime();
    };

    (function() {
        //处理浏览器兼容支持API
        jQuery.support = {};
        //根节点
        var root = document.documentElement,
        //这些节点只要创建一个, 减少内存占用, 提高性能;
            script = document.createElement("script"),
            div = document.createElement("div"),
            id = "script" + now();

        div.style.display = "none";
        div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

        var all = div.getElementsByTagName("*"),
            a = div.getElementsByTagName("a")[0];

        //连getElementByTagName都不好使了, 只能呵呵了;
        // Can't get basic test support
        if ( !all || !all.length || !a ) {
            return;
        };

        jQuery.support = {
            // IE strips leading whitespace when .innerHTML is used
            // IE会自动把innerHTML的头部和尾部空白清除, 标准浏览器全部忠于用户操作;
            leadingWhitespace: div.firstChild.nodeType === 3,

            /*
             var d = document.createElement("div");
             d.innerHTML = "<table></table>";
             var t = d.getElementsByTagName("table")[0];
             //==>> 标准浏览器的结果<table></table>；
             */
            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            //IE会自动补全的;
            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            //看看通过固有属性的方式能不能获取, 用的不多;
            // Get the style information from getAttribute
            // (IE uses .cssText insted)
            style: /red/.test( a.getAttribute("style") ),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            // IE会自动补全整个地址;
            hrefNormalized: a.getAttribute("href") === "/a",

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            //在chrome的某些版本不能用opacity:.55;
            //http://bugs.jquery.com/ticket/5145
            opacity: /^0.55$/.test( a.style.opacity ),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            //styleFloat 和 cssFloat同意处理
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: div.getElementsByTagName("input")[0].value === "on",

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,

            // Will be defined later
            scriptEval: false,
            noCloneEvent: true,
            boxModel: null
        };

        script.type = "text/javascript";
        try {
            script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
        } catch(e) {}

        root.insertBefore( script, root.firstChild );

        // Make sure that the execution of code works by injecting a script
        // tag with appendChild/createTextNode
        // (IE doesn't support this, fails, and uses .text instead)
        if ( window[ id ] ) {
            //是否支持动态的添加script标签,内部的内容自动eval;
            jQuery.support.scriptEval = true;
            delete window[ id ];
        };

        root.removeChild( script );

        //IE下才有这种问题;
        //标准浏览器无路cloneNode还是cloneNode(true)都不会复制事件的;
        if ( div.attachEvent && div.fireEvent ) {
            div.attachEvent("onclick", function click() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                jQuery.support.noCloneEvent = false;
                div.detachEvent("onclick", click);
            });
            div.cloneNode(true).fireEvent("onclick");
        }

        // Figure out if the W3C box model works as expected
        // document.body must exist before we can do this
        // TODO: This timeout is temporary until I move ready into core.js.
        //这个东西要等到dom加载完毕以后才能测试的;
        jQuery(function() {
            var div = document.createElement("div");
            //quirk模式下的border-box模型的width包含了border和padding,导致这个元素的width为1;
            div.style.width = div.style.paddingLeft = "1px";

            document.body.appendChild( div );
            //如果等于2就是标准的盒模型content-box; 
            /*
             box-sizing的五种值:border-box;content-box;padding-box;initial;inherit;
             */
            jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
            document.body.removeChild( div ).style.display = 'none';
            div = null;
        });

        // Technique from Juriy Zaytsev
        // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
        var eventSupported = function( eventName ) {
            var el = document.createElement("div");
            eventName = "on" + eventName;

            //如果这个支持的话就不用走了;
            var isSupported = (eventName in el);
            if ( !isSupported ) {
                //使用固有属性的方法添加字符串"return;";
                el.setAttribute(eventName, "return;");
                isSupported = typeof el[eventName] === "function";
            }
            el = null;

            return isSupported;
        };

        jQuery.support.submitBubbles = eventSupported("submit");
        jQuery.support.changeBubbles = eventSupported("change");

        // release memory in IE
        root = script = div = all = a = null;
    })();

    jQuery.props = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    };
//windowData是为了避免属性系统在window下新建变量, 导致全局污染
    var expando = "jQuery" + now(), uuid = 0, windowData = {};
    var emptyObject = {};

    jQuery.extend({
        cache: {},

        expando:expando,

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            "object": true,
            "applet": true
        },

        data: function( elem, name, data ) {
            if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                return;
            }

            elem = elem == window ?
                windowData :
                elem;

            var id = elem[ expando ], cache = jQuery.cache, thisCache;

            // Handle the case where there's no name immediately
            if ( !name && !id ) {
                return null;
            }

            // Compute a unique ID for the element
            //如果没有id, 为元素分配一个id;
            if ( !id ) {
                id = ++uuid;
            }

            // Avoid generating a new cache unless none exists and we
            // want to manipulate it.
            // 如果是对象这个是覆盖重写缓存数据哦
            if ( typeof name === "object" ) {
                elem[ expando ] = id;
                thisCache = cache[ id ] = jQuery.extend(true, {}, name);
                //获取缓冲中的数据;
            } else if ( cache[ id ] ) {
                thisCache = cache[ id ];
            } else if ( typeof data === "undefined" ) {
                thisCache = emptyObject;
            } else {
                //新建一个数据吧;
                thisCache = cache[ id ] = {};
            }

            // Prevent overriding the named cache with undefined values
            if ( data !== undefined ) {
                elem[ expando ] = id;
                thisCache[ name ] = data;
            }

            //如果没有name就把整个缓冲返回回去;
            return typeof name === "string" ? thisCache[ name ] : thisCache;
        },

        removeData: function( elem, name ) {
            if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                return;
            }

            elem = elem == window ?
                windowData :
                elem;
            //所有缓存的数据       //当前元素的数据
            var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

            // If we want to remove a specific section of the element's data
            if ( name ) {
                if ( thisCache ) {
                    // Remove the section of cache data
                    delete thisCache[ name ];

                    // If we've removed all the data, remove the element's cache
                    if ( jQuery.isEmptyObject(thisCache) ) {
                        jQuery.removeData( elem );
                    }
                }

                // Otherwise, we want to remove all of the element's data
            } else {
                // Clean up the element expando
                //标准下真要删节点属性,IE反正两种都删了就好了呗
                try {
                    delete elem[ expando ];
                } catch( e ) {
                    // IE has trouble directly removing the expando
                    // but it's ok with using removeAttribute
                    if ( elem.removeAttribute ) {
                        elem.removeAttribute( expando );
                    }
                }

                // Completely remove the data cache
                delete cache[ id ];
            }
        }
    });

//原型下面方法的继承;
    jQuery.fn.extend({
        data: function( key, value ) {

            if ( typeof key === "undefined" && this.length ) {
                return jQuery.data( this[0] );

            } else if ( typeof key === "object" ) {
                //设置对象;
                //如果key是对象会把这个对象覆些这个元素的cache;
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }
            //如果key是字符串的话;
            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";

            //这个地方何必使用到事件呢;
            if ( value === undefined ) {
                var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

                if ( data === undefined && this.length ) {
                    data = jQuery.data( this[0], key );
                }
                return data === undefined && parts[1] ?
                    this.data( parts[0] ) :
                    data;
            } else {
                return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
                    jQuery.data( this, key, value );
                });
            }
        },

        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });

//工具上面的queue和dequeue;
    /*
     $.queue(document.body,"","2");
     ["2"];
     */
    jQuery.extend({
        queue: function( elem, type, data ) {
            if ( !elem ) {
                return;
            };

            type = (type || "fx") + "queue";
            var q = jQuery.data( elem, type );

            // Speed up dequeue by getting out quickly if this is just a lookup
            if ( !data ) {
                return q || [];
            }
            //把这些数据弄成数组放进去,（这个应该是覆盖啊）；
            if ( !q || jQuery.isArray(data) ) {
                q = jQuery.data( elem, type, jQuery.makeArray(data) );

            } else {
                q.push( data );
            }

            return q;
        },

        dequeue: function( elem, type ) {
            type = type || "fx";
            var queue = jQuery.queue( elem, type ), fn = queue.shift();

            //获取的第一个是 "inprogress"的话;
            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                //这盘肯定是函数了;
                fn = queue.shift();
            };

            //
            if ( fn ) {
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                //再把这个字符串压进去;
                if ( type === "fx" ) {
                    queue.unshift("inprogress");
                };

                //把这个函数执行, 执行有一个参数, 这个参数是下一个fx函数, 执行后就继续出列;
                fn.call(elem, function() {
                    jQuery.dequeue(elem, type);
                });
            }
        }
    });
    /*
     queue和 dequeue的使用方法;
     $("body").queue(function() {
     console.log(0);
     }).queue(function(next) {
     console.log(1);next();
     }).queue(function(next) {
     console.log(2);next();
     }).queue(function(next) {
     console.log(3);next()
     }).queue(function() {
     console.log(4);
     });

     $("body").dequeue();
     1;
     2;
     3;
     4;
     */
    jQuery.fn.extend({

        queue: function( type, data ) {
            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
            };

            //如果没有type和data就返回第一个;
            if ( data === undefined ) {
                return jQuery.queue( this[0], type );
            };

            //为各个元素添加key为type的 data数据;
            return this.each(function( i, elem ) {
                var queue = jQuery.queue( this, type, data );

                //默认就为fx; 
                //如果第一次执行那么queue[0]就是添加的数据,  就马上执行;
                if ( type === "fx" && queue[0] !== "inprogress" ) {
                    jQuery.dequeue( this, type );
                };
            });
        },

        //迭代每一个this, 然后把type + "queue"的缓存对象拉出来执行;
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },

        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";
            //其实和就是调用queue, 只是延迟了几秒钟;
            return this.queue( type, function() {
                var elem = this;
                setTimeout(function() {
                    jQuery.dequeue( elem, type );
                }, time );
            });
        },

        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        }
    });

    var rclass = /[\n\t]/g,
        rspace = /\s+/,
        rreturn = /\r/g,
        rspecialurl = /href|src|style/,
        rtype = /(button|input)/i,
        rfocusable = /(button|input|object|select|textarea)/i,
        rclickable = /^(a|area)$/i,
        rradiocheck = /radio|checkbox/;

    jQuery.fn.extend({
        attr: function( name, value ) {
            return access( this, name, value, true, jQuery.attr );
        },

        removeAttr: function( name, fn ) {
            return this.each(function(){
                //也是调用原型的attr方法, 只不过值是空的;
                jQuery.attr( this, name, "" );
                if ( this.nodeType === 1 ) {
                    this.removeAttribute( name );
                }
            });
        },

        addClass: function( value ) {
            //是函数就特殊处理;
            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.addClass( value.call(this, i, self.attr("class")) );
                });
            };

            //jQ中的class增加的方法
            if ( value && typeof value === "string" ) {
                var classNames = (value || "").split( rspace );

                for ( var i = 0, l = this.length; i < l; i++ ) {
                    var elem = this[i];

                    if ( elem.nodeType === 1 ) {
                        if ( !elem.className ) {
                            elem.className = value;

                        } else {
                            var className = " " + elem.className + " ";
                            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
                                if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
                                    elem.className += " " + classNames[c];
                                }
                            }
                        }
                    }
                }
            }

            return this;
        },

        //jQ重的class删除方法;
        removeClass: function( value ) {
            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.removeClass( value.call(this, i, self.attr("class")) );
                });
            }

            if ( (value && typeof value === "string") || value === undefined ) {
                var classNames = (value || "").split(rspace);

                for ( var i = 0, l = this.length; i < l; i++ ) {
                    var elem = this[i];

                    if ( elem.nodeType === 1 && elem.className ) {
                        if ( value ) {
                            var className = (" " + elem.className + " ").replace(rclass, " ");
                            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }
                            elem.className = className.substring(1, className.length - 1);

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value, isBool = typeof stateVal === "boolean";

            if ( jQuery.isFunction( value ) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
                });
            }

            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    //转成jQ对象;
                    var className, i = 0, self = jQuery(this),
                        state = stateVal,
                        classNames = value.split( rspace );
                    //第一次还是第0个class的;
                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space seperated list
                        state = isBool ? state : !self.hasClass( className );
                        self[ state ? "addClass" : "removeClass" ]( className );
                    }
                } else if ( type === "undefined" || type === "boolean" ) {
                    //把当前的class保存起来;
                    if ( this.className ) {
                        // store className if set
                        jQuery.data( this, "__className__", this.className );
                    };

                    //$(xx).toggle(false)
                    //$(xx).toggle() 这两种调用方法;
                    //反正是设置;
                    // toggle whole className;
                    this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
                }
            });
        },

        hasClass: function( selector ) {
            var className = " " + selector + " ";
            for ( var i = 0, l = this.length; i < l; i++ ) {
                if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
                    return true;
                }
            }

            return false;
        },

        val: function( value ) {
            //获取值就获取一个;
            if ( value === undefined ) {
                var elem = this[0];

                if ( elem ) {
                    //如果是select下的option;
                    if ( jQuery.nodeName( elem, "option" ) ) {
                        //option.attributes.value && option.attributes.value.specified(指定); 如果这个元素的value有的话;
                        return (elem.attributes.value || {}).specified ? elem.value : elem.text;
                    };

                    // We need to handle select boxes special
                    if ( jQuery.nodeName( elem, "select" ) ) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type === "select-one";

                        // Nothing was selected
                        if ( index < 0 ) {
                            return null;
                        }

                        // Loop through all the selected options
                        // 循环所有的option
                        for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
                            var option = options[ i ];

                            if ( option.selected ) {
                                // Get the specifc value for the option
                                value = jQuery(option).val();

                                // We don't need an array for one selects
                                if ( one ) {
                                    return value;
                                };

                                // Multi-Selects return an array
                                values.push( value );
                            };
                        };

                        //是mutipul的的话;
                        return values;
                    }

                    // chrome浏览器的问题;
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
                        return elem.getAttribute("value") === null ? "on" : elem.value;
                    }

                    //默认的, 有value的元素只有 select, checkbox, radio 这三个元素了;
                    // Everything else, we just grab the value
                    return (elem.value || "").replace(rreturn, "");

                }

                return undefined;
            };

            var isFunction = jQuery.isFunction(value);

            //设置值是设置所有的值;
            return this.each(function(i) {
                var self = jQuery(this), val = value;

                if ( this.nodeType !== 1 ) {
                    return;
                };

                //如果传进来的值, 重新计算需要的值, 参数为这个对象和这个对象的值;
                if ( isFunction ) {
                    val = value.call(this, i, self.val());
                };

                // Typecast each time if the value is a Function and the appended
                // value is therefore different each time.
                if ( typeof val === "number" ) {
                    val += "";
                };

                //你可以传一个数组, 如果这个raido的值有在这个数组里, 元素就设置checked = ture;
                //radio的值应该就一个的                //如果是radio元素;
                if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
                    //args(xx in the yy)
                    this.checked = jQuery.inArray( self.val(), val ) >= 0;
                    //PS : $("<input type='radio' id='r'/>").appendTo($("body"))[0].checked; 默认都为false, 好像webkit的某些版本为"on"
                } else if ( jQuery.nodeName( this, "select" ) ) {
                    //把values变成一个数组;
                    var values = jQuery.makeArray(val);

                    //所有对应的变成选中;
                    jQuery( "option", this ).each(function() {
                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                    });

                    if ( !values.length ) {
                        this.selectedIndex = -1;
                    };

                } else {
                    this.value = val;
                };
            });
        }
    });

//整个的接口
    jQuery.extend({
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },

        attr: function( elem, name, value, pass ) {
            // don't set attributes on text and comment nodes
            //text文本;             //comment注释;
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
                return undefined;
            };

            //如果这个name在attrFn中存在, 就把这个值传进去,快捷设置;
            if ( pass && name in jQuery.attrFn ) {
                return jQuery(elem)[name](value);
            };

            //NODE                 //是XML取反;
            var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
            // Whether we are setting (or getting)
                set = value !== undefined;
            /*
             jQuery.props的属性修复方法: 
             这个存在的意义是因为有一些属性是保留字;
             有一些是因为HTML不区分大小写,但是JS区分大小写的缘故;
             {
             cellspacing: "cellSpacing",
             class: "className",
             colspan: "colSpan",
             for: "htmlFor",
             frameborder: "frameBorder",
             maxlength: "maxLength",
             readonly: "readOnly",
             rowspan: "rowSpan",
             tabindex: "tabIndex",
             usemap: "useMap
             }
             */
            // Try to normalize/fix the name
            name = notxml && jQuery.props[ name ] || name;

            // Only do all the following if this is a node (faster for style)
            if ( elem.nodeType === 1 ) {
                // These attributes require special treatment
                //  rspecialurl ==>> /href|src|style/;
                var special = rspecialurl.test( name );

                //修复safari的bug;
                // Safari mis-reports the default selected property of an option
                // Accessing the parent's selectedIndex property fixes it
                if ( name === "selected" && !jQuery.support.optSelected ) {
                    var parent = elem.parentNode;
                    if ( parent ) {
                        parent.selectedIndex;

                        // Make sure that it also works with optgroups, see #5701
                        if ( parent.parentNode ) {
                            parent.parentNode.selectedIndex;
                        }
                    }
                }

                // If applicable, access the attribute via the DOM 0 way
                if ( name in elem && notxml && !special ) {
                    //设置;
                    if ( set ) {
                        //    /(button|input)/i IE下的button和input的type不能随便更改; 就跟iframe的name和input的name不能随便更改一样;
                        //  We can't allow the type property to be changed (since it causes problems in IE)
                        if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
                            throw "type property can't be changed";
                        }
                        //如果 name in elem说明这个name是 id title className href src这些固有属性和文本属性都有的东西;
                        elem[ name ] = value;
                    };

                    //获取, 处理form的节点的值;
                    // browsers index elements by id/name on forms, give priority to attributes.
                    if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
                        return elem.getAttributeNode( name ).nodeValue;
                    };


                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // 死链;
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/ 
                    // 看看司徒正美的 :http://www.cnblogs.com/rubylouvre/archive/2009/12/07/1618182.html
                    /*
                     知识普及 : tabIndex在浏览器下都支持, tabIndex在W3C是属于节点属性又属于固有属性, 表单元素用的最多, 
                     //DIV等这些块节点在W3C下不能设置tabIndex, 但是所有浏览器厂商都实现了DIV的tabIndex;tabIndex如果有设置值得情况下,无论是通过固有属性还是节点方式获取,
                     值都能获取到,如下 :
                     <div tabindex="2">第二个</div>
                     $("div[tabindex=2]")[0].tabIndex  ==>> 2
                     $("div[tabindex=2]")[0].getAttribute("tabIndex") ==>> "2"
                     //这东西记也感觉记不住;
                     但是没有默认值得情况下, 标准浏览器通过节点属性 获取的值如果是DIV等元素 ==>> -1; 被设置了返回被设置的值； 是input这些元素 ==>> 0
                     如果是input这些元素 通过attribute获取 ==>> null;
                     IE67无论任何方式获取的都是返回0
                     //IE下判断这属性是否被设置;
                     var _hasAttr = function(node, name){
                     var attr = node.getAttributeNode && node.getAttributeNode(name);
                     return attr && attr.specified; // Boolean
                     };
                     */
                    if ( name === "tabIndex" ) {
                        var attributeNode = elem.getAttributeNode( "tabIndex" );

                        return attributeNode && attributeNode.specified ?
                            attributeNode.value :
                            rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                                null :
                                undefined;
                    };

                    return elem[ name ];
                };

                //是固有属性了么么哒;
                if ( !jQuery.support.style && notxml && name === "style" ) {
                    if ( set ) {
                        elem.style.cssText = "" + value;
                    }

                    return elem.style.cssText;
                };

                //统一处理
                if ( set ) {
                    // convert the value to a string (all browsers do this but IE) see #1070
                    elem.setAttribute( name, "" + value );
                };

                //如果是href, src这些链接地址, 统一返回没有改变过的地址;
                var attr = !jQuery.support.hrefNormalized && notxml && special ?
                    // Some attributes require a special call on IE
                    elem.getAttribute( name, 2 ) :
                    elem.getAttribute( name );

                // Non-existent attributes return null, we normalize to undefined
                return attr === null ? undefined : attr;
            }

            // elem is actually elem.style ... set the style
            // Using attr for specific style information is now deprecated. Use style insead.
            return jQuery.style( elem, name, value );
        }
    });

// \ddfsdfsdf\w\s\. fsdfsdf\dfhfgh\ryr\werew  c  vx\\\\c/\v 
// ==>> "ddfsdfsdfws. fsdfsdfdfhfghyrwerew  c  vx\\\\c\/"

    var fcleanup = function( nm ) {
        //着我靠，匹配出来的是3个斜杠;
        return nm.replace(/[^\w\s\.\|`]/g, function( ch ) {
            return "\\" + ch;
        });
    };

    /*
     * A number of helper functions used for managing events.
     * Many of the ideas behind this code originated from
     * Dean Edwards' addEvent library.
     */
    jQuery.event = {

        // Bind an event to an element
        // Original by Dean Edwards
        // http://dean.edwards.name/
        add: function( elem, types, handler, data ) {
            //text和 comment元素混进来了;
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            // For whatever reason, IE has trouble passing the window object
            // around, causing it to be cloned in the process
            if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
                elem = window;
            };

            //无论如何都会设置唯一guid了, 方便进行函数的检索和接触绑定;
            // Make sure that the function being executed has a unique ID
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            };

            // if data is passed, bind to handler
            if ( data !== undefined ) {
                // Create temporary function pointer to original handler
                var fn = handler;

                // Create unique handler function, wrapped around original handler
                handler = jQuery.proxy( fn );

                // Store data in unique handler
                handler.data = data;
            };

            // Init the element's event structure
            var events = jQuery.data( elem, "events" ) || jQuery.data( elem, "events", {} ),
                handle = jQuery.data( elem, "handle" ), eventHandle;

            if ( !handle ) {
                eventHandle = function() {
                    // Handle the second event of a trigger and when
                    // an event is called after a page has unloaded
                    //这个应该不会错误的jQuery !== "undefined", 怎么可能呢?
                    //jQuery.event.triggered默认为false;
                    return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
                        //eventHandle为明确this指向, 所有的事件都是绑定同一个函数的;
                        jQuery.event.handle.apply( eventHandle.elem, arguments ) :
                        undefined;
                };

                //把这个组要handle绑定到缓存对象的handle;
                //而且jQ.data的返回就是指向缓存的指针, so the handle just equels eventHandle;
                handle = jQuery.data( elem, "handle", eventHandle );
            };

            // If no handle is found then we must be trying to bind to one of the
            // banned noData elements
            if ( !handle ) {
                return;
            };

            // Add elem as a property of the handle function
            // This is to prevent a memory leak with non-native
            // event in IE.
            handle.elem = elem;

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            //处理传入的多种事件通过空格分隔的情况;
            types = types.split( /\s+/ );
            var type, i=0;
            while ( (type = types[ i++ ]) ) {
                // Namespaced event handlers
                // "click.xx.yy.zz" 命名空间的作用;
                var namespaces = type.split(".");
                type = namespaces.shift();
                //把命名空间放到 函数下面;
                handler.type = namespaces.slice(0).sort().join(".");

                //获取事件列表;
                /*
                 special ==>>
                 ready            function    function            
                 live            function    function    Object
                 beforeunload    function    function            
                 mouseenter        function    function            
                 mouseleave        function    function            
                 focusin            function    function            
                 focusout        function    function            
                 //基本都有四个方法;
                 setup
                 teardown
                 add
                 remove
                 */
                // Get the current list of functions bound to this event
                var handlers = events[ type ],
                    special = this.special[ type ] || {};



                // Init the event handler queue
                if ( !handlers ) {
                    //首先初始化事件列表, 对每一种类型的事件都要绑定同一个的handle;
                    handlers = events[ type ] = {};

                    // Check for a special event handler
                    // Only use addEventListener/attachEvent if the special
                    // events handler returns false
                    //如果pecial.setup为true, 就会跑后面的结果;
                    //像在chrome中不支持mouseenter的话就会用mouseover模拟mouseenter,
                    //重新绑定一次事件, 返回为false;
                    if ( !special.setup || special.setup.call( elem, data, namespaces, handler) === false ) {
                        //统一绑定 handle;
                        // Bind the global event handler to the element
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, handle, false );
                        } else if ( elem.attachEvent ) {
                            elem.attachEvent( "on" + type, handle );
                        }
                    }
                }

                //只有spcial的live中有add方法, 又是fix什么东西的额;
                if ( special.add ) {
                    var modifiedHandler = special.add.call( elem, handler, data, namespaces, handlers );
                    if ( modifiedHandler && jQuery.isFunction( modifiedHandler ) ) {
                        modifiedHandler.guid = modifiedHandler.guid || handler.guid;
                        handler = modifiedHandler;
                    }
                }

                //事件用guid进行
                // Add the function to the element's handler list
                handlers[ handler.guid ] = handler;

                //优化;
                // Keep track of which events have been used, for global triggering
                this.global[ type ] = true;
            };

            // Nullify elem to prevent memory leaks in IE
            elem = null;
            /*
             testObject = {
             :
             "events" : {
             "click" : {
             : function() {},
             : function() {},
             : function() {}
             }
             },
             handle : {
             elem : "body"
             }
             }
             */
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function( elem, types, handler ) {
            // don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            var events = jQuery.data( elem, "events" ), ret, type, fn;

            if ( events ) {
                // Unbind all events for the element
                //清空所有的事件            //没有事件但是有对应的事件命名空间;
                if ( types === undefined || (typeof types === "string" && types.charAt(0) === ".") ) {
                    for ( type in events ) {
                        //简单的迭代;
                        this.remove( elem, type + (types || "") );
                    }
                } else {
                    //传进来的可能是对象, 字符串;

                    // types is actually an event object here
                    //处理对象的情况;
                    if ( types.type ) {
                        handler = types.handler;
                        types = types.type;
                    };

                    // Handle multiple events separated by a space
                    // jQuery(...).unbind("mouseover mouseout", fn);
                    types = types.split(/\s+/);
                    var i = 0;
                    while ( (type = types[ i++ ]) ) {
                        // Namespaced event handlers
                        var namespaces = type.split(".");
                        type = namespaces.shift();
                        var all = !namespaces.length,
                            cleaned = jQuery.map( namespaces.slice(0).sort(), fcleanup ),
                            namespace = new RegExp("(^|\\.)" + cleaned.join("\\.(?:.*\\.)?") + "(\\.|$)"),
                            special = this.special[ type ] || {};

                        if ( events[ type ] ) {
                            // remove the given handler for the given type
                            if ( handler ) {
                                fn = events[ type ][ handler.guid ];
                                delete events[ type ][ handler.guid ];

                                // remove all handlers for the given type
                            } else {
                                for ( var handle in events[ type ] ) {
                                    // Handle the removal of namespaced events
                                    if ( all || namespace.test( events[ type ][ handle ].type ) ) {
                                        delete events[ type ][ handle ];
                                    }
                                }
                            }

                            if ( special.remove ) {
                                special.remove.call( elem, namespaces, fn);
                            }

                            // remove generic event handler if no more handlers exist
                            for ( ret in events[ type ] ) {
                                break;
                            }
                            if ( !ret ) {
                                if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
                                    if ( elem.removeEventListener ) {
                                        elem.removeEventListener( type, jQuery.data( elem, "handle" ), false );
                                    } else if ( elem.detachEvent ) {
                                        elem.detachEvent( "on" + type, jQuery.data( elem, "handle" ) );
                                    }
                                }
                                ret = null;
                                delete events[ type ];
                            }
                        }
                    }
                }

                // Remove the expando if it's no longer used
                for ( ret in events ) {
                    break;
                }
                if ( !ret ) {
                    var handle = jQuery.data( elem, "handle" );
                    if ( handle ) {
                        handle.elem = null;
                    }
                    jQuery.removeData( elem, "events" );
                    jQuery.removeData( elem, "handle" );
                }
            }
        },

        // bubbling is internal
        //event是必须传的参数, 其余的可以不传;
        trigger: function( event, data, elem /*, bubbling */ ) {
            // Event object or event type
            var type = event.type || event,
                bubbling = arguments[3];

            if ( !bubbling ) {
                //初始化的时候的bubbling是false, 冒泡到父级元素的时候不会走这边;
                event = typeof event === "object" ?
                    // jQuery.Event object, 传进来的就是jQ的事件对象;
                    event[expando] ? event : // xx = xxx===xxx ? yy ? yy : yy : yy 者里面写法不同, 但是是一样样的;
                        // Object literals       // xx = xxx===xxx ? (yy ? yy : yy) : yy
                        jQuery.extend( jQuery.Event(type), event ) :
                    // Just the event type (string)
                    //直接新建一个对象
                    jQuery.Event(type);

                //TODO : 事件对象会有    !click;
                if ( type.indexOf("!") >= 0 ) {
                    event.type = type = type.slice(0, -1);
                    event.exclusive = true;
                };

                // Handle a global trigger
                if ( !elem ) {
                    // Don't bubble custom events when global (to avoid too much overhead)
                    //没有元素的话执行handle会出现各种冒泡的情况,任何元素的冒泡都只执行一次;
                    //这个event是已经fix过的event, 
                    //那么元素的所有事件触发就都不会发生冒泡了, 直接模拟一个一个执行就好了;
                    event.stopPropagation();

                    // Only trigger if we've ever bound an event for it
                    // 获取缓存中的所有guid下的handle下的元素,用这些元素迭代该元素缓存中的指定事件;
                    if ( this.global[ type ] ) {
                        jQuery.each( jQuery.cache, function() {
                            if ( this.events && this.events[type] ) {
                                jQuery.event.trigger( event, data, this.handle.elem );
                            }
                        });
                    };
                };

                // Handle triggering a single element

                // don't do events on text and comment nodes
                if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
                    return undefined;
                }

                // Clean up in case it is reused
                event.result = undefined;
                event.target = elem;

                // Clone the incoming data, if any
                data = jQuery.makeArray( data );
                data.unshift( event );
            };
            //if !bubbling完毕

            event.currentTarget = elem;

            // Trigger the event, it is assumed that "handle" is a function
            var handle = jQuery.data( elem, "handle" );
            if ( handle ) {
                //data的第一个就是event的type, event已经取消冒泡过了, 现在使用手动冒泡;
                //使用handle直接跑就好了;
                handle.apply( elem, data );
            }

            //一大段处理兼容的问题Start
            //如果有通过 DOM0 绑定的元素也直接触发事件;
            var nativeFn, nativeHandler;
            try {
                if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
                    nativeFn = elem[ type ];
                    nativeHandler = elem[ "on" + type ];
                }
                // prevent IE from throwing an error for some elements with some event types, see #3533
            } catch (e) {}

            var isClick = jQuery.nodeName(elem, "a") && type === "click";

            //手动触发以DOM0元素添加的事件;
            // Trigger the native events (except for clicks on links)
            if ( !bubbling && nativeFn && !event.isDefaultPrevented() && !isClick ) {
                this.triggered = true;
                try {
                    elem[ type ]();
                    // prevent IE from throwing an error for some hidden elements
                } catch (e) {};

                // Handle triggering native .onfoo handlers
            } else if ( nativeHandler && elem[ "on" + type ].apply( elem, data ) === false ) {
                event.result = false;
            }
            //一大段处理兼容的问题End;

            this.triggered = false;

            if ( !event.isPropagationStopped() ) {
                var parent = elem.parentNode || elem.ownerDocument;
                //这个完全是没事自己一个一个往上冒泡上去;
                if ( parent ) {
                    jQuery.event.trigger( event, data, parent, true );
                }
            }
        },

        //这个就是高版本的dispatch
        handle: function( event ) {
            // returned undefined or false
            var all, handlers;
            //修复event对象
            event = arguments[0] = jQuery.event.fix( event || window.event );
            event.currentTarget = this;

            // Namespaced event handlers
            var namespaces = event.type.split(".");
            event.type = namespaces.shift();

            // Cache this now, all = true means, any handler
            all = !namespaces.length && !event.exclusive;
            //正则, 不是很懂;
            var namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");

            //所有的事件描述对象;
            handlers = ( jQuery.data(this, "events") || {} )[ event.type ];

            for ( var j in handlers ) {
                var handler = handlers[ j ];

                // Filter the functions by class
                //只要找到匹配的t命名空间即可;
                if ( all || namespace.test(handler.type) ) {
                    // Pass in a reference to the handler function itself
                    // So that we can later remove it

                    //修正event的handler的数据和event.data
                    //在事件函数的事件对象可以找到对应的数据;
                    event.handler = handler;
                    event.data = handler.data;

                    //这个是有返回值的;
                    var ret = handler.apply( this, arguments );

                    //如果上一个的ret有返回值, 把这个返回值指向下一个event, 为什么有了延迟对象的感觉;
                    if ( ret !== undefined ) {
                        event.result = ret;
                        if ( ret === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }

                    if ( event.isImmediatePropagationStopped() ) {
                        break;
                    }

                }
            }

            return event.result;
        },

        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

        fix: function( event ) {
            //如果event有 expando的话 , 就不是已经fix过的意思;
            if ( event[ expando ] ) {
                return event;
            }

            // store a copy of the original event object
            // and "clone" to set read-only properties
            var originalEvent = event;

            /*设置或者复制事件的几个属性包括
             jQuery1416879535126: true 
             originalEvent: MouseEvent 原始的事件信息
             timeStamp: 1416885709219 //时间戳
             type: "mouseover" //事件类型;
             */
            event = jQuery.Event( originalEvent );

            //altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey 
            //currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey 
            //newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget 
            //screenX screenY shiftKey srcElement target toElement view wheelDelta which;
            for ( var i = this.props.length, prop; i; ) {
                prop = this.props[ --i ];
                event[ prop ] = originalEvent[ prop ];
            }

            //修复浏览器的srcElement为标准的target;
            // Fix target property, if necessary
            if ( !event.target ) {
                event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
            }

            //事件修复;
            // check if target is a textnode (safari)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            //这个只有在模拟mouseenter和mouseleave的时候有用;
            // Add relatedTarget, if necessary
            if ( !event.relatedTarget && event.fromElement ) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            //修复没有event.pageX 和pageY
            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && event.clientX != null ) {
                var doc = document.documentElement, body = document.body;
                //这个要减去padding的;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
            };

            // Add which for key events
            if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
                event.which = event.charCode || event.keyCode;
            };

            //MAC下有meta, 让meta等于ctrolKey;
            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if ( !event.metaKey && event.ctrlKey ) {
                event.metaKey = event.ctrlKey;
            };

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && event.button !== undefined ) {
                event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
            };

            return event;
        },

        // Deprecated, use jQuery.guid instead
        guid: 1E8,

        // Deprecated, use jQuery.proxy instead
        proxy: jQuery.proxy,

        special: {
            ready: {
                // Make sure the ready event is setup
                setup: jQuery.bindReady,
                teardown: jQuery.noop
            },

            live: {
                add: function( proxy, data, namespaces, live ) {
                    jQuery.extend( proxy, data || {} );

                    proxy.guid += data.selector + data.live;
                    jQuery.event.add( this, data.live, liveHandler, data );

                },

                remove: function( namespaces ) {
                    if ( namespaces.length ) {
                        var remove = 0, name = new RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");

                        jQuery.each( (jQuery.data(this, "events").live || {}), function() {
                            if ( name.test(this.type) ) {
                                remove++;
                            }
                        });

                        if ( remove < 1 ) {
                            jQuery.event.remove( this, namespaces[0], liveHandler );
                        }
                    }
                },
                special: {}
            },
            beforeunload: {
                setup: function( data, namespaces, fn ) {
                    // We only want to do this special case on windows
                    if ( this.setInterval ) {
                        this.onbeforeunload = fn;
                    }

                    return false;
                },
                teardown: function( namespaces, fn ) {
                    if ( this.onbeforeunload === fn ) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };

//事件对象的的工厂和事件对象的原型定义;
    jQuery.Event = function( src ) {
        // Allow instantiation without the 'new' keyword
        if ( !this.preventDefault ) {
            return new jQuery.Event( src );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;
            // Event type
        } else {
            this.type = src;
        }

        // timeStamp is buggy for some events on Firefox(#3843)
        // So we won't rely on the native value
        this.timeStamp = now();

        // Mark it as fixed
        this[ expando ] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }

            // if preventDefault exists run it on the original event
            // 标准浏览器下阻止默认事件
            if ( e.preventDefault ) {
                e.preventDefault();
            }
            // otherwise set the returnValue property of the original event to false (IE)
            // IE下阻止默认事件要设置returnValue为false
            e.returnValue = false;
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if ( e.stopPropagation ) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };


//下面都是对事件进行修复;
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
    var withinElement = function( event ) {
            // Check if mouse(over|out) are still within the same parent element
            var parent = event.relatedTarget;

            // Traverse up the tree
            while ( parent && parent !== this ) {
                // Firefox sometimes assigns relatedTarget a XUL element
                // which we cannot access the parentNode property of
                try {
                    parent = parent.parentNode;

                    // assuming we've left the element since we most likely mousedover a xul element
                } catch(e) {
                    break;
                }
            }

            if ( parent !== this ) {
                // set the correct event type
                event.type = event.data;

                // handle event if we actually just moused on to a non sub-element
                jQuery.event.handle.apply( this, arguments );
            }

        },

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
        delegate = function( event ) {
            event.type = event.data;
            jQuery.event.handle.apply( this, arguments );
        };

// Create mouseenter and mouseleave events
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            setup: function( data ) {
                jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
            },
            teardown: function( data ) {
                jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
            }
        };
    });

// submit delegation
    if ( !jQuery.support.submitBubbles ) {

        jQuery.event.special.submit = {
            setup: function( data, namespaces, fn ) {
                if ( this.nodeName.toLowerCase() !== "form" ) {
                    jQuery.event.add(this, "click.specialSubmit." + fn.guid, function( e ) {
                        var elem = e.target, type = elem.type;

                        if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
                            return trigger( "submit", this, arguments );
                        }
                    });

                    jQuery.event.add(this, "keypress.specialSubmit." + fn.guid, function( e ) {
                        var elem = e.target, type = elem.type;

                        if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
                            return trigger( "submit", this, arguments );
                        }
                    });

                } else {
                    return false;
                }
            },

            remove: function( namespaces, fn ) {
                jQuery.event.remove( this, "click.specialSubmit" + (fn ? "."+fn.guid : "") );
                jQuery.event.remove( this, "keypress.specialSubmit" + (fn ? "."+fn.guid : "") );
            }
        };

    };

// change delegation, happens here so we have bind.
    if ( !jQuery.support.changeBubbles ) {

        var formElems = /textarea|input|select/i;

        function getVal( elem ) {
            var type = elem.type, val = elem.value;

            if ( type === "radio" || type === "checkbox" ) {
                val = elem.checked;

            } else if ( type === "select-multiple" ) {
                val = elem.selectedIndex > -1 ?
                    jQuery.map( elem.options, function( elem ) {
                        return elem.selected;
                    }).join("-") :
                    "";

            } else if ( elem.nodeName.toLowerCase() === "select" ) {
                val = elem.selectedIndex;
            }

            return val;
        }

        function testChange( e ) {
            var elem = e.target, data, val;

            if ( !formElems.test( elem.nodeName ) || elem.readOnly ) {
                return;
            }

            data = jQuery.data( elem, "_change_data" );
            val = getVal(elem);

            if ( val === data ) {
                return;
            }

            // the current data will be also retrieved by beforeactivate
            if ( e.type !== "focusout" || elem.type !== "radio" ) {
                jQuery.data( elem, "_change_data", val );
            }

            if ( elem.type !== "select" && (data != null || val) ) {
                e.type = "change";
                return jQuery.event.trigger( e, arguments[1], this );
            }
        }

        jQuery.event.special.change = {
            filters: {
                focusout: testChange,

                click: function( e ) {
                    var elem = e.target, type = elem.type;

                    if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
                        return testChange.call( this, e );
                    }
                },

                // Change has to be called before submit
                // Keydown will be called before keypress, which is used in submit-event delegation
                keydown: function( e ) {
                    var elem = e.target, type = elem.type;

                    if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
                        (e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
                        type === "select-multiple" ) {
                        return testChange.call( this, e );
                    }
                },

                // Beforeactivate happens also before the previous element is blurred
                // with this event you can't trigger a change event, but you can store
                // information/focus[in] is not needed anymore
                beforeactivate: function( e ) {
                    var elem = e.target;

                    if ( elem.nodeName.toLowerCase() === "input" && elem.type === "radio" ) {
                        jQuery.data( elem, "_change_data", getVal(elem) );
                    }
                }
            },
            setup: function( data, namespaces, fn ) {
                for ( var type in changeFilters ) {
                    jQuery.event.add( this, type + ".specialChange." + fn.guid, changeFilters[type] );
                }

                return formElems.test( this.nodeName );
            },
            remove: function( namespaces, fn ) {
                for ( var type in changeFilters ) {
                    jQuery.event.remove( this, type + ".specialChange" + (fn ? "."+fn.guid : ""), changeFilters[type] );
                }

                return formElems.test( this.nodeName );
            }
        };

        var changeFilters = jQuery.event.special.change.filters;

    }

    function trigger( type, elem, args ) {
        args[0].type = type;
        return jQuery.event.handle.apply( elem, args );
    }

// Create "bubbling" focus and blur events
    if ( document.addEventListener ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
            jQuery.event.special[ fix ] = {
                setup: function() {
                    this.addEventListener( orig, handler, true );
                },
                //teardown是拆卸的意思;
                teardown: function() {
                    this.removeEventListener( orig, handler, true );
                }
            };

            function handler( e ) {
                e = jQuery.event.fix( e );
                e.type = fix;
                return jQuery.event.handle.call( this, e );
            }
        });
    };

//这个在执行的时候( $("xx").bind() )的this指向这个选中的元素;
    jQuery.each(["bind", "one"], function( i, name ) {
        jQuery.fn[ name ] = function( type, data, fn ) {
            // Handle object literals
            if ( typeof type === "object" ) {
                for ( var key in type ) {
                    this[ name ](key, data, type[key], fn);
                }
                return this;
            };

            //修正参数;
            if ( jQuery.isFunction( data ) ) {
                thisObject = fn;
                fn = data;
                data = undefined;
            };

            //如果不是one 就直接设置handler为传进来的fn, 否者把handler加了一层壳;
            var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
                //去除绑定handler;
                //this指向fn;
                jQuery( this ).unbind( event, handler );
                return fn.apply( this, arguments );
            }) : fn;


            //现在是直接绑定元素了;
            return type === "unload" && name !== "one" ?
                this.one( type, data, fn, thisObject ) :
                //一般是走这边的; 
                //data可以是是好几个参数的集合;
                this.each(function() {
                    jQuery.event.add( this, type, handler, data );
                });
        };
        //总结,主要是处理是否执行once, 以及each  this;对每一个元素进行绑定;
    });

    jQuery.fn.extend({
        unbind: function( type, fn ) {
            // Handle object literals
            if ( typeof type === "object" && !type.preventDefault ) {
                for ( var key in type ) {
                    this.unbind(key, type[key]);
                }
                return this;
            }

            return this.each(function() {
                jQuery.event.remove( this, type, fn );
            });
        },
        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },
        //triggerHandler不会触发默认动作, 是触发这个集合的第一个元素;
        triggerHandler: function( type, data ) {
            if ( this[0] ) {
                var event = jQuery.Event( type );
                event.preventDefault();
                event.stopPropagation();
                jQuery.event.trigger( event, data, this[0] );
                return event.result;
            }
        },
        /*
         $(document).ready(function(){
         $("button").toggle(function(){
         $("body").css("background-color","green");},
         function(){
         $("body").css("background-color","red");},
         function(){
         $("body").css("background-color","yellow");}
         );
         });
         */
        toggle: function( fn ) {
            // Save reference to arguments for access in closure
            var args = arguments, i = 1;
            //debugger;
            // link all the functions, so any of them can unbind this click handler
            // 在log中看到的arg为 [1,2,3,4,5] ==>> 仿佛就是数组了;
            // Object.prototype.toString.call( args ) ==>> "[object Arguments]";

            //fn.guid = arguments任意一个函数的guid;
            while ( i < args.length ) {
                jQuery.proxy( fn, args[ i++ ] );
            };

            return this.click( jQuery.proxy( fn, function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            }));
        },

        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        },

        live: function( type, data, fn ) {
            if ( jQuery.isFunction( data ) ) {
                fn = data;
                data = undefined;
            }

            jQuery( this.context ).bind( liveConvert( type, this.selector ), {
                data: data, selector: this.selector, live: type
            }, fn );

            return this;
        },

        die: function( type, fn ) {
            jQuery( this.context ).unbind( liveConvert( type, this.selector ), fn ? { guid: fn.guid + this.selector + type } : null );
            return this;
        }
    });

    function liveHandler( event ) {
        var stop = true, elems = [], selectors = [], args = arguments,
            related, match, fn, elem, j, i, data,
            live = jQuery.extend({}, jQuery.data( this, "events" ).live);

        for ( j in live ) {
            fn = live[j];
            if ( fn.live === event.type ||
                fn.altLive && jQuery.inArray(event.type, fn.altLive) > -1 ) {

                data = fn.data;
                if ( !(data.beforeFilter && data.beforeFilter[event.type] &&
                    !data.beforeFilter[event.type](event)) ) {
                    selectors.push( fn.selector );
                }
            } else {
                delete live[j];
            }
        }

        match = jQuery( event.target ).closest( selectors, event.currentTarget );

        for ( i = 0, l = match.length; i < l; i++ ) {
            for ( j in live ) {
                fn = live[j];
                elem = match[i].elem;
                related = null;

                if ( match[i].selector === fn.selector ) {
                    // Those two events require additional checking
                    if ( fn.live === "mouseenter" || fn.live === "mouseleave" ) {
                        related = jQuery( event.relatedTarget ).closest( fn.selector )[0];
                    }

                    if ( !related || related !== elem ) {
                        elems.push({ elem: elem, fn: fn });
                    }
                }
            }
        }

        for ( i = 0, l = elems.length; i < l; i++ ) {
            match = elems[i];
            event.currentTarget = match.elem;
            event.data = match.fn.data;
            if ( match.fn.apply( match.elem, args ) === false ) {
                stop = false;
                break;
            }
        }

        return stop;
    }

    function liveConvert( type, selector ) {
        return ["live", type, selector.replace(/\./g, "`").replace(/ /g, "&")].join(".");
    };

//快捷添加事件函数的方式;
    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( fn ) {
            return fn ? this.bind( name, fn ) : this.trigger( name );
        };

        //这个干嘛用呢;
        if ( jQuery.attrFn ) {
            jQuery.attrFn[ name ] = true;
        }
    });

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
    /*
     如这种情况;
     (function(){
     var obj={b:document.body};
     document.body.o=obj; // ← circular link is created. document.body.o.b === document.body
     })();
     */
    if ( window.attachEvent && !window.addEventListener ) {
        window.attachEvent("onunload", function() {
            for ( var id in jQuery.cache ) {
                if ( jQuery.cache[ id ].handle ) {
                    // Try/Catch is to handle iframes being unloaded, see #4280
                    //IE的unload自动清空内存中的事件;
                    try {
                        jQuery.event.remove( jQuery.cache[ id ].handle.elem );
                    } catch(e) {}
                }
            }
        });
    }
    /*!
     * Sizzle CSS Selector Engine - v1.0
     *  Copyright 2009, The Dojo Foundation
     *  Released under the MIT, BSD, and GPL Licenses.
     *  More information: http://sizzlejs.com/
     */
    (function(){

        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            done = 0,
            toString = Object.prototype.toString,
            hasDuplicate = false,
            baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
        [0, 0].sort(function(){
            baseHasDuplicate = false;
            return 0;
        });

        var Sizzle = function(selector, context, results, seed) {
            results = results || [];
            var origContext = context = context || document;

            if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
                return [];
            }

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
                soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
                soFar = m[3];

                parts.push( m[1] );

                if ( m[2] ) {
                    extra = m[3];
                    break;
                }
            }

            if ( parts.length > 1 && origPOS.exec( selector ) ) {
                if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
                    set = posProcess( parts[0] + parts[1], context );
                } else {
                    set = Expr.relative[ parts[0] ] ?
                        [ context ] :
                        Sizzle( parts.shift(), context );

                    while ( parts.length ) {
                        selector = parts.shift();

                        if ( Expr.relative[ selector ] ) {
                            selector += parts.shift();
                        }

                        set = posProcess( selector, set );
                    }
                }
            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                    Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
                    var ret = Sizzle.find( parts.shift(), context, contextXML );
                    context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
                }

                if ( context ) {
                    var ret = seed ?
                    { expr: parts.pop(), set: makeArray(seed) } :
                        Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
                    set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

                    if ( parts.length > 0 ) {
                        checkSet = makeArray(set);
                    } else {
                        prune = false;
                    }

                    while ( parts.length ) {
                        var cur = parts.pop(), pop = cur;

                        if ( !Expr.relative[ cur ] ) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if ( pop == null ) {
                            pop = context;
                        }

                        Expr.relative[ cur ]( checkSet, pop, contextXML );
                    }
                } else {
                    checkSet = parts = [];
                }
            }

            if ( !checkSet ) {
                checkSet = set;
            }

            if ( !checkSet ) {
                throw "Syntax error, unrecognized expression: " + (cur || selector);
            }

            if ( toString.call(checkSet) === "[object Array]" ) {
                if ( !prune ) {
                    results.push.apply( results, checkSet );
                } else if ( context && context.nodeType === 1 ) {
                    for ( var i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
                            results.push( set[i] );
                        }
                    }
                } else {
                    for ( var i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                            results.push( set[i] );
                        }
                    }
                }
            } else {
                makeArray( checkSet, results );
            }

            if ( extra ) {
                Sizzle( extra, origContext, results, seed );
                Sizzle.uniqueSort( results );
            }

            return results;
        };

        Sizzle.uniqueSort = function(results){
            if ( sortOrder ) {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);

                if ( hasDuplicate ) {
                    for ( var i = 1; i < results.length; i++ ) {
                        if ( results[i] === results[i-1] ) {
                            results.splice(i--, 1);
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function(expr, set){
            return Sizzle(expr, null, null, set);
        };

        Sizzle.find = function(expr, context, isXML){
            var set, match;

            if ( !expr ) {
                return [];
            }

            for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
                var type = Expr.order[i], match;

                if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
                    var left = match[1];
                    match.splice(1,1);

                    if ( left.substr( left.length - 1 ) !== "\\" ) {
                        match[1] = (match[1] || "").replace(/\\/g, "");
                        set = Expr.find[ type ]( match, context, isXML );
                        if ( set != null ) {
                            expr = expr.replace( Expr.match[ type ], "" );
                            break;
                        }
                    }
                }
            }

            if ( !set ) {
                set = context.getElementsByTagName("*");
            }

            return {set: set, expr: expr};
        };

        Sizzle.filter = function(expr, set, inplace, not){
            var old = expr, result = [], curLoop = set, match, anyFound,
                isXMLFilter = set && set[0] && isXML(set[0]);

            while ( expr && set.length ) {
                for ( var type in Expr.filter ) {
                    if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                        var filter = Expr.filter[ type ], found, item, left = match[1];
                        anyFound = false;

                        match.splice(1,1);

                        if ( left.substr( left.length - 1 ) === "\\" ) {
                            continue;
                        }

                        if ( curLoop === result ) {
                            result = [];
                        }

                        if ( Expr.preFilter[ type ] ) {
                            match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                            if ( !match ) {
                                anyFound = found = true;
                            } else if ( match === true ) {
                                continue;
                            }
                        }

                        if ( match ) {
                            for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
                                if ( item ) {
                                    found = filter( item, match, i, curLoop );
                                    var pass = not ^ !!found;

                                    if ( inplace && found != null ) {
                                        if ( pass ) {
                                            anyFound = true;
                                        } else {
                                            curLoop[i] = false;
                                        }
                                    } else if ( pass ) {
                                        result.push( item );
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if ( found !== undefined ) {
                            if ( !inplace ) {
                                curLoop = result;
                            }

                            expr = expr.replace( Expr.match[ type ], "" );

                            if ( !anyFound ) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if ( expr === old ) {
                    if ( anyFound == null ) {
                        throw "Syntax error, unrecognized expression: " + expr;
                    } else {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        var Expr = Sizzle.selectors = {
            order: [ "ID", "NAME", "TAG" ],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(elem){
                    return elem.getAttribute("href");
                }
            },
            relative: {
                "+": function(checkSet, part){
                    var isPartStr = typeof part === "string",
                        isTag = isPartStr && !/\W/.test(part),
                        isPartStrNotTag = isPartStr && !isTag;

                    if ( isTag ) {
                        part = part.toLowerCase();
                    }

                    for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                        if ( (elem = checkSet[i]) ) {
                            while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                                elem || false :
                                elem === part;
                        }
                    }

                    if ( isPartStrNotTag ) {
                        Sizzle.filter( part, checkSet, true );
                    }
                },
                ">": function(checkSet, part){
                    var isPartStr = typeof part === "string";

                    if ( isPartStr && !/\W/.test(part) ) {
                        part = part.toLowerCase();

                        for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                            var elem = checkSet[i];
                            if ( elem ) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }
                    } else {
                        for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                            var elem = checkSet[i];
                            if ( elem ) {
                                checkSet[i] = isPartStr ?
                                    elem.parentNode :
                                    elem.parentNode === part;
                            }
                        }

                        if ( isPartStr ) {
                            Sizzle.filter( part, checkSet, true );
                        }
                    }
                },
                "": function(checkSet, part, isXML){
                    var doneName = done++, checkFn = dirCheck;

                    if ( typeof part === "string" && !/\W/.test(part) ) {
                        var nodeCheck = part = part.toLowerCase();
                        checkFn = dirNodeCheck;
                    }

                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },
                "~": function(checkSet, part, isXML){
                    var doneName = done++, checkFn = dirCheck;

                    if ( typeof part === "string" && !/\W/.test(part) ) {
                        var nodeCheck = part = part.toLowerCase();
                        checkFn = dirNodeCheck;
                    }

                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },
            find: {
                ID: function(match, context, isXML){
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);
                        return m ? [m] : [];
                    }
                },
                NAME: function(match, context){
                    if ( typeof context.getElementsByName !== "undefined" ) {
                        var ret = [], results = context.getElementsByName(match[1]);

                        for ( var i = 0, l = results.length; i < l; i++ ) {
                            if ( results[i].getAttribute("name") === match[1] ) {
                                ret.push( results[i] );
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },
                TAG: function(match, context){
                    return context.getElementsByTagName(match[1]);
                }
            },
            preFilter: {
                CLASS: function(match, curLoop, inplace, result, not, isXML){
                    match = " " + match[1].replace(/\\/g, "") + " ";

                    if ( isXML ) {
                        return match;
                    }

                    for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                        if ( elem ) {
                            if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
                                if ( !inplace ) {
                                    result.push( elem );
                                }
                            } else if ( inplace ) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },
                ID: function(match){
                    return match[1].replace(/\\/g, "");
                },
                TAG: function(match, curLoop){
                    return match[1].toLowerCase();
                },
                CHILD: function(match){
                    if ( match[1] === "nth" ) {
                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
                            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                                !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },
                ATTR: function(match, curLoop, inplace, result, not, isXML){
                    var name = match[1].replace(/\\/g, "");

                    if ( !isXML && Expr.attrMap[name] ) {
                        match[1] = Expr.attrMap[name];
                    }

                    if ( match[2] === "~=" ) {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },
                PSEUDO: function(match, curLoop, inplace, result, not){
                    if ( match[1] === "not" ) {
                        // If we're dealing with a complex expression, or a simple one
                        if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                            match[3] = Sizzle(match[3], null, null, curLoop);
                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                            if ( !inplace ) {
                                result.push.apply( result, ret );
                            }
                            return false;
                        }
                    } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                        return true;
                    }

                    return match;
                },
                POS: function(match){
                    match.unshift( true );
                    return match;
                }
            },
            filters: {
                enabled: function(elem){
                    return elem.disabled === false && elem.type !== "hidden";
                },
                disabled: function(elem){
                    return elem.disabled === true;
                },
                checked: function(elem){
                    return elem.checked === true;
                },
                selected: function(elem){
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    elem.parentNode.selectedIndex;
                    return elem.selected === true;
                },
                parent: function(elem){
                    return !!elem.firstChild;
                },
                empty: function(elem){
                    return !elem.firstChild;
                },
                has: function(elem, i, match){
                    return !!Sizzle( match[3], elem ).length;
                },
                header: function(elem){
                    return /h\d/i.test( elem.nodeName );
                },
                text: function(elem){
                    return "text" === elem.type;
                },
                radio: function(elem){
                    return "radio" === elem.type;
                },
                checkbox: function(elem){
                    return "checkbox" === elem.type;
                },
                file: function(elem){
                    return "file" === elem.type;
                },
                password: function(elem){
                    return "password" === elem.type;
                },
                submit: function(elem){
                    return "submit" === elem.type;
                },
                image: function(elem){
                    return "image" === elem.type;
                },
                reset: function(elem){
                    return "reset" === elem.type;
                },
                button: function(elem){
                    return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
                },
                input: function(elem){
                    return /input|select|textarea|button/i.test(elem.nodeName);
                }
            },
            setFilters: {
                first: function(elem, i){
                    return i === 0;
                },
                last: function(elem, i, match, array){
                    return i === array.length - 1;
                },
                even: function(elem, i){
                    return i % 2 === 0;
                },
                odd: function(elem, i){
                    return i % 2 === 1;
                },
                lt: function(elem, i, match){
                    return i < match[3] - 0;
                },
                gt: function(elem, i, match){
                    return i > match[3] - 0;
                },
                nth: function(elem, i, match){
                    return match[3] - 0 === i;
                },
                eq: function(elem, i, match){
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function(elem, match, i, array){
                    var name = match[1], filter = Expr.filters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );
                    } else if ( name === "contains" ) {
                        return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
                    } else if ( name === "not" ) {
                        var not = match[3];

                        for ( var i = 0, l = not.length; i < l; i++ ) {
                            if ( not[i] === elem ) {
                                return false;
                            }
                        }

                        return true;
                    } else {
                        throw "Syntax error, unrecognized expression: " + name;
                    }
                },
                CHILD: function(elem, match){
                    var type = match[1], node = elem;
                    switch (type) {
                        case 'only':
                        case 'first':
                            while ( (node = node.previousSibling) )     {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }
                            if ( type === "first" ) {
                                return true;
                            }
                            node = elem;
                        case 'last':
                            while ( (node = node.nextSibling) )     {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }
                            return true;
                        case 'nth':
                            var first = match[2], last = match[3];

                            if ( first === 1 && last === 0 ) {
                                return true;
                            }

                            var doneName = match[0],
                                parent = elem.parentNode;

                            if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
                                var count = 0;
                                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                    if ( node.nodeType === 1 ) {
                                        node.nodeIndex = ++count;
                                    }
                                }
                                parent.sizcache = doneName;
                            }

                            var diff = elem.nodeIndex - last;
                            if ( first === 0 ) {
                                return diff === 0;
                            } else {
                                return ( diff % first === 0 && diff / first >= 0 );
                            }
                    }
                },
                ID: function(elem, match){
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },
                TAG: function(elem, match){
                    return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
                },
                CLASS: function(elem, match){
                    return (" " + (elem.className || elem.getAttribute("class")) + " ")
                        .indexOf( match ) > -1;
                },
                ATTR: function(elem, match){
                    var name = match[1],
                        result = Expr.attrHandle[ name ] ?
                            Expr.attrHandle[ name ]( elem ) :
                            elem[ name ] != null ?
                                elem[ name ] :
                                elem.getAttribute( name ),
                        value = result + "",
                        type = match[2],
                        check = match[4];

                    return result == null ?
                        type === "!=" :
                        type === "=" ?
                            value === check :
                            type === "*=" ?
                                value.indexOf(check) >= 0 :
                                type === "~=" ?
                                    (" " + value + " ").indexOf(check) >= 0 :
                                    !check ?
                                        value && result !== false :
                                        type === "!=" ?
                                            value !== check :
                                            type === "^=" ?
                                                value.indexOf(check) === 0 :
                                                type === "$=" ?
                                                    value.substr(value.length - check.length) === check :
                                                    type === "|=" ?
                                                        value === check || value.substr(0, check.length + 1) === check + "-" :
                                                        false;
                },
                POS: function(elem, match, i, array){
                    var name = match[2], filter = Expr.setFilters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );
                    }
                }
            }
        };

        var origPOS = Expr.match.POS;

        for ( var type in Expr.match ) {
            Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
            Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, function(all, num){
                return "\\" + (num - 0 + 1);
            }));
        }

        var makeArray = function(array, results) {
            array = Array.prototype.slice.call( array, 0 );

            if ( results ) {
                results.push.apply( results, array );
                return results;
            }

            return array;
        };

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
        try {
            Array.prototype.slice.call( document.documentElement.childNodes, 0 );

// Provide a fallback method if it does not work
        } catch(e){
            makeArray = function(array, results) {
                var ret = results || [];

                if ( toString.call(array) === "[object Array]" ) {
                    Array.prototype.push.apply( ret, array );
                } else {
                    if ( typeof array.length === "number" ) {
                        for ( var i = 0, l = array.length; i < l; i++ ) {
                            ret.push( array[i] );
                        }
                    } else {
                        for ( var i = 0; array[i]; i++ ) {
                            ret.push( array[i] );
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder;

        if ( document.documentElement.compareDocumentPosition ) {
            sortOrder = function( a, b ) {
                if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
                    if ( a == b ) {
                        hasDuplicate = true;
                    }
                    return a.compareDocumentPosition ? -1 : 1;
                }

                var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
                if ( ret === 0 ) {
                    hasDuplicate = true;
                }
                return ret;
            };
        } else if ( "sourceIndex" in document.documentElement ) {
            sortOrder = function( a, b ) {
                if ( !a.sourceIndex || !b.sourceIndex ) {
                    if ( a == b ) {
                        hasDuplicate = true;
                    }
                    return a.sourceIndex ? -1 : 1;
                }

                var ret = a.sourceIndex - b.sourceIndex;
                if ( ret === 0 ) {
                    hasDuplicate = true;
                }
                return ret;
            };
        } else if ( document.createRange ) {
            sortOrder = function( a, b ) {
                if ( !a.ownerDocument || !b.ownerDocument ) {
                    if ( a == b ) {
                        hasDuplicate = true;
                    }
                    return a.ownerDocument ? -1 : 1;
                }

                var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
                aRange.setStart(a, 0);
                aRange.setEnd(a, 0);
                bRange.setStart(b, 0);
                bRange.setEnd(b, 0);
                var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
                if ( ret === 0 ) {
                    hasDuplicate = true;
                }
                return ret;
            };
        }

// Utility function for retreiving the text value of an array of DOM nodes
        function getText( elems ) {
            var ret = "", elem;

            for ( var i = 0; elems[i]; i++ ) {
                elem = elems[i];

                // Get the text from text nodes and CDATA nodes
                if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
                    ret += elem.nodeValue;

                    // Traverse everything else, except comment nodes
                } else if ( elem.nodeType !== 8 ) {
                    ret += getText( elem.childNodes );
                }
            }

            return ret;
        }

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
        (function(){
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"),
                id = "script" + (new Date).getTime();
            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            var root = document.documentElement;
            root.insertBefore( form, root.firstChild );

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if ( document.getElementById( id ) ) {
                Expr.find.ID = function(match, context, isXML){
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);
                        return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                    }
                };

                Expr.filter.ID = function(elem, match){
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild( form );
            root = form = null; // release memory in IE
        })();

        (function(){
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild( document.createComment("") );

            // Make sure no comments are found
            if ( div.getElementsByTagName("*").length > 0 ) {
                Expr.find.TAG = function(match, context){
                    var results = context.getElementsByTagName(match[1]);

                    // Filter out possible comments
                    if ( match[1] === "*" ) {
                        var tmp = [];

                        for ( var i = 0; results[i]; i++ ) {
                            if ( results[i].nodeType === 1 ) {
                                tmp.push( results[i] );
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";
            if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
                div.firstChild.getAttribute("href") !== "#" ) {
                Expr.attrHandle.href = function(elem){
                    return elem.getAttribute("href", 2);
                };
            }

            div = null; // release memory in IE
        })();

        if ( document.querySelectorAll ) {
            (function(){
                var oldSizzle = Sizzle, div = document.createElement("div");
                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
                    return;
                }

                Sizzle = function(query, context, extra, seed){
                    context = context || document;

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if ( !seed && context.nodeType === 9 && !isXML(context) ) {
                        try {
                            return makeArray( context.querySelectorAll(query), extra );
                        } catch(e){}
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for ( var prop in oldSizzle ) {
                    Sizzle[ prop ] = oldSizzle[ prop ];
                }

                div = null; // release memory in IE
            })();
        }

        (function(){
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if ( div.getElementsByClassName("e").length === 1 ) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function(match, context, isXML) {
                if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
                    return context.getElementsByClassName(match[1]);
                }
            };

            div = null; // release memory in IE
        })();

        function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];
                if ( elem ) {
                    elem = elem[dir];
                    var match = false;

                    while ( elem ) {
                        if ( elem.sizcache === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 && !isXML ){
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }

                        if ( elem.nodeName.toLowerCase() === cur ) {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];
                if ( elem ) {
                    elem = elem[dir];
                    var match = false;

                    while ( elem ) {
                        if ( elem.sizcache === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 ) {
                            if ( !isXML ) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }
                            if ( typeof cur !== "string" ) {
                                if ( elem === cur ) {
                                    match = true;
                                    break;
                                }

                            } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        var contains = document.compareDocumentPosition ? function(a, b){
            return a.compareDocumentPosition(b) & 16;
        } : function(a, b){
            return a !== b && (a.contains ? a.contains(b) : true);
        };

        var isXML = function(elem){
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833) 
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        var posProcess = function(selector, context){
            var tmpSet = [], later = "", match,
                root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
                later += match[0];
                selector = selector.replace( Expr.match.PSEUDO, "" );
            }

            selector = Expr.relative[selector] ? selector + "*" : selector;

            for ( var i = 0, l = root.length; i < l; i++ ) {
                Sizzle( selector, root[i], tmpSet );
            }

            return Sizzle.filter( later, tmpSet );
        };

//sizzle有1000行, jQuery的find就是sizzle
// EXPOSE
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.getText = getText;
        jQuery.isXMLDoc = isXML;
        jQuery.contains = contains;

        return;

        window.Sizzle = Sizzle;

    })();


    var runtil = /Until$/,
    //非贪婪匹配;
        rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
        rmultiselector = /,/,
        slice = Array.prototype.slice;
    /*
     if(1) {
     console.log(1)
     }else if (1){ 
     console.log(1)
     } else if(1) {
     console.log(1)
     }else{
     console.log(2)
     };
     // 1, hehe;
     */

// Implement the identical functionality for filter and not
    //winnow(this, selector, true)
    //winnow(this, selector, false)
    var winnow = function( elements, qualifier, keep ) {
        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep(elements, function( elem, i ) {
                return !!qualifier.call( elem, i, elem ) === keep;
            });

        } else if ( qualifier.nodeType ) {
            return jQuery.grep(elements, function( elem, i ) {
                return (elem === qualifier) === keep;
            });

        } else if ( typeof qualifier === "string" ) {
            var filtered = jQuery.grep(elements, function( elem ) {
                return elem.nodeType === 1;
            });

            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter( qualifier, elements );
            }
        }

        return jQuery.grep(elements, function( elem, i ) {
            return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
        });
    };

    jQuery.fn.extend({
        find: function( selector ) {
            //保存引用;
            //debugger;
            var ret = this.pushStack( "", "find", selector ), length = 0;


            for ( var i = 0, l = this.length; i < l; i++ ) {
                length = ret.length;
                jQuery.find( selector, this[i], ret );

                if ( i > 0 ) {
                    // 使用underscore中德unique也行，使用indexOf实现更好点;
                    // Make sure that the results are unique
                    for ( var n = length; n < ret.length; n++ ) {
                        for ( var r = 0; r < length; r++ ) {
                            if ( ret[r] === ret[n] ) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        //has是对当前的结果集合进行操作的, 可以传字符串或者jQ对象或者原生元素对象, 相当于unique的效果;
        has: function( target ) {
            var targets = jQuery( target );
            return this.filter(function() {
                for ( var i = 0, l = targets.length; i < l; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },

        not: function( selector ) {
            //winnow 辨别; 选择; 除去;
            //pushStack是把当前的实例元素设置和selector到当前winnow出来的元素保存
            //selector的保存形式为nowSelector.not( newSelector );
            return this.pushStack( winnow(this, selector, false), "not", selector);
        },

        //not和filter都是对当前的元素做操作, 匹配符合选择符的操作;
        filter: function( selector ) {
            return this.pushStack( winnow(this, selector, true), "filter", selector );
        },

        //直接调用filter就好了;
        is: function( selector ) {
            return !!selector && jQuery.filter( selector, this ).length > 0;
        },

        closest: function( selectors, context ) {
            //closest还能传数组的, 我勒个去
            if ( jQuery.isArray( selectors ) ) {
                var ret = [], cur = this[0], match, matches = {}, selector;

                if ( cur && selectors.length ) {

                    //对match的元素进行操作;
                    for ( var i = 0, l = selectors.length; i < l; i++ ) {
                        selector = selectors[i];

                        if ( !matches[selector] ) {
                            matches[selector] = jQuery.expr.match.POS.test( selector ) ?
                                jQuery( selector, context || this.context ) :
                                selector;
                        }
                    }

                    //两层循环;
                    while ( cur && cur.ownerDocument && cur !== context ) {
                        for ( selector in matches ) {
                            match = matches[selector];

                            if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
                                ret.push({ selector: selector, elem: cur });
                                delete matches[selector];
                            }
                        }
                        cur = cur.parentNode;
                    }
                }

                return ret;
            }
            //    /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)(?![^\[]*\])(?![^\(]*\))/
            var pos = jQuery.expr.match.POS.test( selectors ) ?
                //没有context就是document了
                //如果匹配的是某些jQ的选择器的话, 就通过选择器把这个元素匹配出来, 相当于把当前元素的所有父级和选择出来的元素进行交集,就取第一个匹配的元素;
                jQuery( selectors, context || this.context ) : null;

            return this.map(function( i, cur ) {
                while ( cur && cur.ownerDocument && cur !== context ) {
                    //
                    //is调用的是实例上面的filter;
                    if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
                        return cur;
                    }
                    cur = cur.parentNode;
                }
                return null;
            });
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {
            if ( !elem || typeof elem === "string" ) {
                //当前第一个元素;
                return jQuery.inArray( this[0],
                    // If it receives a string, the selector is used
                    // If it receives nothing, the siblings are used
                    //所有匹配出来的元素;           //父级的元素;
                    elem ? jQuery( elem ) : this.parent().children() );
            }

            //如果传进来的事jQ对象;
            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this );
        },

        add: function( selector, context ) {
            //传进来的selecotr
            var set = typeof selector === "string" ?
                    jQuery( selector, context || this.context ) :
                    jQuery.makeArray( selector ),
            //把set的值merge到all元素;
                all = jQuery.merge( this.get(), set );

            //保存栈;
            return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
                all :
                jQuery.unique( all ) );
        },

        andSelf: function() {
            //这个用的不多
            return this.add( this.prevObject );
        }
    });

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
    function isDisconnected( node ) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    };

// 最烦循环这种压缩优化写法;
    jQuery.each({
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            //匹配出来所有的父级;
            return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return jQuery.nth( elem, 2, "nextSibling" );
        },
        prev: function( elem ) {
            return jQuery.nth( elem, 2, "previousSibling" );
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( elem.parentNode.firstChild, elem );
        },
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.makeArray( elem.childNodes );
        }
    }, function( name, fn ) {
        /*
         如果是parents的话就走了回调;
         如果是
         */
        jQuery.fn[ name ] = function( until, selector ) {
            //jQuery的map的第三个参数和以后的参数会作为回调的第三个和第三个以外的参数;
            var ret = jQuery.map( this, fn, until );

            // name  的正则是  /Until$/ , 只有nextUntil和prevUntil才有这个;
            if ( !runtil.test( name ) ) {
                selector = until;
            };

            if ( selector && typeof selector === "string" ) {
                ret = jQuery.filter( selector, ret );
            };

            //对元素进行唯一处理;
            ret = this.length > 1 ? jQuery.unique( ret ) : ret;

            //    rmultiselector的值是/,/
            //rparentsprev的值是/^(?:parents|prevUntil|prevAll)/
            if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
                ret = ret.reverse();
            };

            return this.pushStack( ret, name, slice.call(arguments).join(",") );
        };
    });

    jQuery.extend({
        filter: function( expr, elems, not ) {
            if ( not ) {
                expr = ":not(" + expr + ")";
            }

            return jQuery.find.matches(expr, elems);
        },
        /*
         顾名思义 dir表示方向, 
         这个dir是对next prev parent child进行操作的适配器;
         */
        dir: function( elem, dir, until ) {
            var matched = [], cur = elem[dir];

            //INFO: :document.nodeType === 9
            //jQuery( cur ).is( until )为真就假了
            while ( cur && cur.nodeType !== 9 && (until === undefined || !jQuery( cur ).is( until )) ) {
                if ( cur.nodeType === 1 ) {
                    matched.push( cur );
                }
                cur = cur[dir];
            }
            return matched;
        },

        /*
         ( elem, 2, "nextSibling" );
         ( elem, 2, "previousSibling" );
         */
        nth: function( cur, result, dir, elem ) {
            result = result || 1;
            var num = 0;

            //for ( ; cur; cur = cur[dir] ) 吊死的写法;
            for ( ; cur; cur = cur[dir] ) {
                if ( cur.nodeType === 1 && ++num === result ) {
                    break;
                }
            }

            return cur;
        },

        sibling: function( n, elem ) {
            var r = [];

            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }

            return r;
        }
    });


    var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g, //克隆时候避免克隆jQueryExpando;
        rleadingWhitespace = /^\s+/,    //前空格
    /*
     rxhtmlTag.test("<div />")
     true
     rxhtmlTag.test("<div sdfsdf/>")
     false
     rxhtmlTag.test("<div sdfsdf />")
     true
     rxhtmlTag.test("<sdfsddiv sdfsdf />")
     false
     rxhtmlTag.test("<asd sdfsdf />")
     true
     */
        rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,     //匹配单标签;
        rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i, //匹配自我封闭的标签;
        rtagName = /<([\w:]+)/,
    /*
     "<div >".match(r)
     ["<div", "div"]
     "<div dsfdsf>".match(r)
     ["<div", "div"]
     "<ssdiv dsfdsf>".match(r)
     ["<ssdiv", "ssdiv"]
     */
        rtbody = /<tbody/i,
        rhtml = /<|&\w+;/, //&nbsp; //&gt; // &lt;....
        fcloseTag = function( all, front, tag ) {
            return rselfClosing.test( tag ) ?
                all :
                front + "></" + tag + ">";
        },
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            _default: [ 0, "", "" ]
        };

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
    if ( !jQuery.support.htmlSerialize ) {
        wrapMap._default = [ 1, "div<div>", "</div>" ];
    }

    jQuery.fn.extend({
        text: function( text ) {
            if ( jQuery.isFunction(text) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    return self.text( text.call(this, i, self.text()) );
                });
            }

            //设置;
            if ( typeof text !== "object" && text !== undefined ) {
                return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
            };

            //返回;
            return jQuery.getText( this );
        },

        wrapAll: function( html ) {
            //一般我写代码的迭代都是放在最后的, jQ的各种迭代比如（extend）； 都是先判断然后放在前面的;
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapAll( html.call(this, i) );
                });
            }

            if ( this[0] ) {
                // The elements to wrap the target around
                //生成元素, 克隆元素节点;
                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

                if ( this[0].parentNode ) {
                    //这个调用的是jQ对象的insertBefore,  不是原生的方法..;
                    wrap.insertBefore( this[0] );
                };

                //把所有选中的元素append到wrap的第一个元素里面;
                wrap.map(function() {
                    var elem = this;

                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function( html ) {
            return this.each(function() {
                //保存当前元素的内容;
                var self = jQuery( this ), contents = self.contents();

                //把当前的元素包用传进来的html进行包含;
                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    //没有内容的话就相当于self.html( html );
                    self.append( html );
                }
            });
        },

        wrap: function( html ) {
            return this.each(function() {
                jQuery( this ).wrapAll( html );
            });
        },

        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    //把当前元素的父级删除;
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        },

        append: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 ) {
                    this.appendChild( elem );
                }
            });
        },

        prepend: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 ) {
                    this.insertBefore( elem, this.firstChild );
                }
            });
        },

        //domManip就是属性系统中德access啊, 主要的作用就是统一处理各种个样的参数；
        before: function() {
            if ( this[0] && this[0].parentNode ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this );
                });
            } else if ( arguments.length ) {
                var set = jQuery(arguments[0]);
                set.push.apply( set, this.toArray() );
                return this.pushStack( set, "before", arguments );
            }
        },

        after: function() {
            if ( this[0] && this[0].parentNode ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                });
            } else if ( arguments.length ) {
                var set = this.pushStack( this, "after", arguments );
                set.push.apply( set, jQuery(arguments[0]).toArray() );
                return set;
            }
        },

        clone: function( events ) {
            // Do the clone
            //ret的是原生的节点元素;
            var ret = this.map(function() {
                if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
                    // IE copies events bound via attachEvent when
                    // using cloneNode. Calling detachEvent on the
                    // clone will also remove the events from the orignal
                    // In order to get around this, we use innerHTML.
                    // Unfortunately, this means some modifications to
                    // attributes in IE that are actually only stored
                    // as properties will not be copied (such as the
                    // the name attribute on an input).

                    //某些浏览器没有outerHTML的属性, 模拟新建一个div获取outerHTML;
                    var html = this.outerHTML, ownerDocument = this.ownerDocument;
                    if ( !html ) {
                        var div = ownerDocument.createElement("div");
                        div.appendChild( this.cloneNode(true) );
                        html = div.innerHTML;
                    }

                    //去除expando
                    return jQuery.clean([html.replace(rinlinejQuery, "")
                        //去除头部的空格;
                        .replace(rleadingWhitespace, "")], ownerDocument)[0];
                } else {
                    return this.cloneNode(true);
                };
            });

            // Copy the events from the original to the clone
            if ( events === true ) {
                cloneCopyEvent( this, ret );
                cloneCopyEvent( this.find("*"), ret.find("*") );
            }

            // Return the cloned set
            return ret;
        },

        html: function( value ) {
            //返回值;
            if ( value === undefined ) {
                return this[0] && this[0].nodeType === 1 ?
                    this[0].innerHTML.replace(rinlinejQuery, "") :
                    null;

                // See if we can take a shortcut and just use innerHTML
                //一堆兼容检测;
            } else if ( typeof value === "string" && !/<script/i.test( value ) &&
                (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
                !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

                try {
                    for ( var i = 0, l = this.length; i < l; i++ ) {
                        // Remove element nodes and prevent memory leaks
                        if ( this[i].nodeType === 1 ) {
                            cleanData( this[i].getElementsByTagName("*") );
                            this[i].innerHTML = value;
                        }
                    }

                    // If using innerHTML throws an exception, use the fallback method
                } catch(e) {
                    this.empty().append( value );
                }

                //是函数的话;
            } else if ( jQuery.isFunction( value ) ) {
                this.each(function(i){
                    var self = jQuery(this), old = self.html();
                    self.empty().append(function(){
                        return value.call( this, i, old );
                    });
                });

                //最后的情况下这样办;
            } else {
                this.empty().append( value );
            }

            return this;
        },

        replaceWith: function( value ) {
            if ( this[0] && this[0].parentNode ) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if ( !jQuery.isFunction( value ) ) {
                    value = jQuery( value ).detach();
                }

                return this.each(function() {
                    var next = this.nextSibling, parent = this.parentNode;

                    jQuery(this).remove();

                    if ( next ) {
                        jQuery(next).before( value );
                    } else {
                        jQuery(parent).append( value );
                    }
                });
            } else {
                //估计这个是内部用的;
                return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
            }
        },

        detach: function( selector ) {
            //虽然这个元素被删除了, 但是这个元素的缓存中的数据还是在的;
            return this.remove( selector, true );
        },
        /*
         var o = document.createDocumentFragment()
         o.nodeType === 11
         */
        domManip: function( args, table, callback ) {
            var results, first, value = args[0], scripts = [];
            //默认就对第一个元素进行操作, 如果要对多个元素操作就要传function进来才行;

            //value是 arg[0], 如果你的参数是function 就迭代this;
            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    //重新定义function的返回值, 并重新跑;
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    return self.domManip( args, table, callback );
                });
            }

            if ( this[0] ) {
                // If we're in a fragment, just use that instead of building a new one
                //如果传进来的就是fragment;
                if ( args[0] && args[0].parentNode && args[0].parentNode.nodeType === 11 ) {
                    results = { fragment: args[0].parentNode };
                } else {
                    //如果是字符串就会把这些元素新建成fragment元素;
                    //会把script的节点全部拿出来;
                    results = buildFragment( args, this, scripts );
                }

                first = results.fragment.firstChild;

                //连first都没有继续处理元素就没有什么意义了;
                if ( first ) {
                    table = table && jQuery.nodeName( first, "tr" );

                    for ( var i = 0, l = this.length; i < l; i++ ) {
                        /*
                         function append( elem ) {
                         if ( this.nodeType === 1 ) {
                         this.appendChild( elem );
                         };
                         };

                         //还要处理table这事情的确挺麻烦的;
                         function root( elem, cur ) {
                         return jQuery.nodeName(elem, "table") ?
                         //如果elem是table就将this下的tbody作为指针,不存在tbody就新建一个tbody;
                         (elem.getElementsByTagName("tbody")[0] ||
                         elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
                         elem;
                         };
                         */
                        callback.call(
                            table ?
                                root(this[i], first) :
                                this[i],
                            //                   //如果有多个选中的元素就是复制; 
                            results.cacheable || this.length > 1 || i > 0 ?
                                results.fragment.cloneNode(true) :
                                results.fragment
                        );
                    };
                };

                //我擦.这个是直接eval的说;
                /*
                 function evalScript( i, elem ) {
                 //如果是地址类型;
                 if ( elem.src ) {
                 jQuery.ajax({
                 url: elem.src,
                 async: false,
                 dataType: "script"
                 });
                 } else {
                 //如果这个是生成出来的标签, 把这个标签的内容eval出来;
                 jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
                 };

                 if ( elem.parentNode ) {
                 elem.parentNode.removeChild( elem );
                 };
                 }
                 */
                if ( scripts ) {
                    jQuery.each( scripts, evalScript );
                }
            }

            return this;

            /*尼玛, 长见识了, 居然偷偷放在这边*/
            function root( elem, cur ) {
                return jQuery.nodeName(elem, "table") ?
                    (elem.getElementsByTagName("tbody")[0] ||
                        elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
                    elem;
            }
        }
    });

    function cloneCopyEvent(orig, ret) {
        var i = 0;

        //复制事件;
        ret.each(function() {
            if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
                return;
            }

            var oldData = jQuery.data( orig[i++] ), curData = jQuery.data( this, oldData ), events = oldData && oldData.events;

            if ( events ) {
                delete curData.handle;
                curData.events = {};

                for ( var type in events ) {
                    for ( var handler in events[ type ] ) {
                        jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
                    }
                }
            }
        });
    }

    function buildFragment( args, nodes, scripts ) {
        var fragment, cacheable, cached, cacheresults, doc;

        //这个主要是对缓存进行优化;
        if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && args[0].indexOf("<option") < 0 ) {
            cacheable = true;
            cacheresults = jQuery.fragments[ args[0] ];
            if ( cacheresults ) {
                if ( cacheresults !== 1 ) {
                    fragment = cacheresults;
                }
                cached = true;
            };
        };

        if ( !fragment ) {
            //获取doc
            doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);
            //获取 fragment元素;
            fragment = doc.createDocumentFragment();
            jQuery.clean( args, doc, fragment, scripts );
        };

        //如果可以缓存的话;
        if ( cacheable ) {
            //不存在这个字符串的缓冲就设置为 新的fragment节点;
            jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
        };

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var ret = [], insert = jQuery( selector );

            for ( var i = 0, l = insert.length; i < l; i++ ) {
                var elems = (i > 0 ? this.clone(true) : this).get();
                jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
                ret = ret.concat( elems );
            }
            return this.pushStack( ret, name, insert.selector );
        };
    });

    jQuery.each({
        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            if ( !selector || jQuery.filter( selector, [ this ] ).length ) {
                if ( !keepData && this.nodeType === 1 ) {
                    cleanData( this.getElementsByTagName("*") );
                    cleanData( [ this ] );
                }

                if ( this.parentNode ) {
                    this.parentNode.removeChild( this );
                }
            }
        },

        empty: function() {
            // Remove element nodes and prevent memory leaks
            //删除每一个元素在expando, 这样就避免了内存引用;
            if ( this.nodeType === 1 ) {
                cleanData( this.getElementsByTagName("*") );
            }

            //一个一个删除, 删除方式, 有点叼;
            //while( $("body")[0].firstChild ) $("body")[0].removeChild( $("body")[0].firstChild )
            // Remove any remaining nodes
            while ( this.firstChild ) {
                this.removeChild( this.firstChild );
            }
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function() {
            return this.each( fn, arguments );
        };
    });

    jQuery.extend({
        // "<div sdfsdf>sdfsd</div>sdfdsfsd<script src='test.js'></script>sdfsd<script>var a = 1</script>fsdfsd";
        clean: function( elems, context, fragment, scripts ) {
            context = context || document;

            // !context.createElement fails in IE with an error but returns typeof 'object'
            if ( typeof context.createElement === "undefined" ) {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            var ret = [];

            jQuery.each(elems, function( i, elem ) {
                if ( typeof elem === "number" ) {
                    elem += "";
                }

                if ( !elem ) {
                    return;
                }

                // Convert html string into DOM nodes
                if ( typeof elem === "string" && !rhtml.test( elem ) ) {
                    elem = context.createTextNode( elem );

                } else if ( typeof elem === "string" ) {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(rxhtmlTag, fcloseTag);

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
                        wrap = wrapMap[ tag ] || wrapMap._default,
                        depth = wrap[0],
                        div = context.createElement("div");

                    // Go to html and back, then peel off extra wrappers
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    // Move to the right depth
                    while ( depth-- ) {
                        div = div.lastChild;
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if ( !jQuery.support.tbody ) {

                        // String was a <table>, *may* have spurious <tbody>
                        var hasBody = rtbody.test(elem),
                            tbody = tag === "table" && !hasBody ?
                                div.firstChild && div.firstChild.childNodes :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                        for ( var j = tbody.length - 1; j >= 0 ; --j ) {
                            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                            }
                        }

                    }

                    // IE completely kills leading whitespace when innerHTML is used
                    if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                        div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                    }

                    elem = jQuery.makeArray( div.childNodes );
                }

                if ( elem.nodeType ) {
                    ret.push( elem );
                } else {
                    ret = jQuery.merge( ret, elem );
                }

            });
            //ret的值为"[object HTMLDivElement],[object Text],[object HTMLScriptElement],[object Text],[object HTMLScriptElement],[object Text]";

            if ( fragment ) {
                for ( var i = 0; ret[i]; i++ ) {
                    //如果是script标签的话,删除节点,并把节点放到scripts这个数组中;
                    if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
                        scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
                    } else {
                        //如果是元素节点;
                        if ( ret[i].nodeType === 1 ) {
                            ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
                        };

                        fragment.appendChild( ret[i] );
                    };
                };
            };

            return ret;
        }
    });

//删除expando;
    function cleanData( elems ) {
        for ( var i = 0, elem, id; (elem = elems[i]) != null; i++ ) {
            if ( !jQuery.noData[elem.nodeName.toLowerCase()] && (id = elem[expando]) ) {
                delete jQuery.cache[ id ];
            };
        };
    };



// exclude the following css properties to add px
    //value,  bold,700..  //0.1.. //1,2.. //px|100%|1;
    var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
    //匹配透明度的值;
        ralpha = /alpha\([^)]*\)/,
    //用来匹配IE的;
        ropacity = /opacity=([^)]*)/,
    //浮动;
        rfloat = /float/i,
    //转驼峰, 匹配横杆后面的字符
        rdashAlpha = /-([a-z])/ig,
    //驼峰转-或者_
        rupper = /([A-Z])/g,
    //匹配正数或者负数数字或者有px的数字;
        rnumpx = /^-?\d+(?:px)?$/i,
    //匹配正数或者负数数字
        rnum = /^-?\d/,

        cssShow = { position: "absolute", visibility: "hidden", display:"block" },
        cssWidth = [ "Left", "Right" ],
        cssHeight = [ "Top", "Bottom" ],

    // cache check for defaultView.getComputedStyle
        getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
    // normalize float css property
        styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        };

    jQuery.fn.css = function( name, value ) {
        return access( this, name, value, true, function( elem, name, value ) {
            if ( value === undefined ) {
                return jQuery.curCSS( elem, name );
            }

            if ( typeof value === "number" && !rexclude.test(name) ) {
                value += "px";
            }

            jQuery.style( elem, name, value );
        });
    };

    jQuery.extend({
        //style只处理了style的内部样式;
        style: function( elem, name, value ) {
            // don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
                return undefined;
            }
            /*
             Description 

             The follwoing code causes IE (at least IE 7) to throw a script error:

             $(function() { $('div').width(-1); });
             (if .size() is > 0).

             Obviously, it doesn't like negative values for width.
             */
            // ignore negative width and height values #1599
            if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
                value = undefined;
            }

            var style = elem.style || elem, set = value !== undefined;

            // IE uses filters for opacity
            // 单独处理IE的filter;
            if ( !jQuery.support.opacity && name === "opacity" ) {
                if ( set ) {
                    // IE has trouble with opacity if it does not have layout
                    // Force it by setting the zoom level
                    // 强制设置IE的layout, 只有块元素才有添加透明度;
                    style.zoom = 1;

                    // Set the alpha filter to set the opacity
                    // 设置的值;
                    var opacity = parseInt( value, 10 ) + "" === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
                    //获取的值;
                    //"dropshadow(color=#9BAD71, offx=5, offy=5)" 如果有多个滤镜的话就有问题了；jQ为毛不处理这个问题;
                    var filter = style.filter || jQuery.curCSS( elem, "filter" ) || "";
                    //直接设置;
                    style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
                }

                //在返回设置的值;
                return style.filter && style.filter.indexOf("opacity=") >= 0 ?
                    (parseFloat( ropacity.exec(style.filter)[1] ) / 100) + "":
                    "";
            }

            // Make sure we're using the right name for getting the float value
            if ( rfloat.test( name ) ) {
                name = styleFloat;
            }

            name = name.replace(rdashAlpha, fcamelCase);

            //设置值;
            if ( set ) {
                style[ name ] = value;
            };

            //返回值;
            return style[ name ];
        },
        //force表示从getStyle进行获取;
        css: function( elem, name, force, extra ) {
            //如果是宽和高, 根据盒模型进行单独处理;
            if ( name === "width" || name === "height" ) {
                //cssShow === Object {position: "absolute", visibility: "hidden", display: "block"};
                //cssWidth ["Left", "Right"];
                var val, props = cssShow, which = name === "width" ? cssWidth : cssHeight;

                function getWH() {
                    //offset的值不存在兼容问题;
                    val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

                    //
                    if ( extra === "border" ) {
                        return;
                    }

                    //对总的offset进行处理;
                    jQuery.each( which, function() {
                        //如果有margin就把margin加上去;
                        //如果时padding的话就把border删除
                        //如果是content就是不传值, 把padding和border全删除;
                        if ( !extra ) {
                            val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
                        }

                        if ( extra === "margin" ) {
                            val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
                        } else {
                            val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
                        }
                    });
                }

                if ( elem.offsetWidth !== 0 ) {
                    getWH();
                } else {
                    //等于0 说明是隐藏或者是不可见的状态;
                    jQuery.swap( elem, props, getWH );
                }

                return Math.max(0, Math.round(val));
            }

            return jQuery.curCSS( elem, name, force );
        },

        curCSS: function( elem, name, force ) {
            var ret, style = elem.style, filter;

            // IE uses filters for opacity
            // 单独处理IE的滤镜问题;
            if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
                ret = ropacity.test(elem.currentStyle.filter || "") ?
                    (parseFloat(RegExp.$1) / 100) + "" :
                    "";

                return ret === "" ?
                    "1" :
                    ret;
            };

            // Make sure we're using the right name for getting the float value
            if ( rfloat.test( name ) ) {
                name = styleFloat;
            };

            //如果有行内样式就返回行内样式 .( 如果有的样式不是在行内, 但是有!important的话 );
            if ( !force && style && style[ name ] ) {
                ret = style[ name ];

            } else if ( getComputedStyle ) {

                // Only "float" is needed here
                // rfloat === /float/i,
                if ( rfloat.test( name ) ) {
                    name = "float";
                };

                //转驼峰写法;
                name = name.replace( rupper, "-$1" ).toLowerCase();

                var defaultView = elem.ownerDocument.defaultView;

                if ( !defaultView ) {
                    return null;
                }
                /*
                 var e = document.createDocumentFragment();
                 var t = document.createTextNode("text"); 
                 e.appendChild( t );
                 e.ownerDocument;
                 #document;

                 t.ownerDocument;
                 #document;
                 */
                //没有处理获取伪类的情况;
                var computedStyle = defaultView.getComputedStyle( elem, null );

                if ( computedStyle ) {
                    ret = computedStyle.getPropertyValue( name );
                }

                //如果是opacity且没有值, 就返回1;
                // We should always get a number back from opacity
                if ( name === "opacity" && ret === "" ) {
                    ret = "1";
                }

            } else if ( elem.currentStyle ) {
                //单独处理IE的样式;
                var camelCase = name.replace(rdashAlpha, fcamelCase);

                ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

                // From the awesome hack by Dean Edwards
                // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

                // If we're not dealing with a regular pixel number
                // but a number that has a weird ending, we need to convert it to pixels
                if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
                    // Remember the original values
                    var left = style.left, rsLeft = elem.runtimeStyle.left;

                    // Put in the new values to get a computed value out
                    elem.runtimeStyle.left = elem.currentStyle.left;
                    style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
                    ret = style.pixelLeft + "px";

                    // Revert the changed values
                    style.left = left;
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret;
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        // 元素隐藏的情况下获取不到width height 等其他值;
        // 所以要把元素显示以后在隐藏, 配置主要根据options;
        swap: function( elem, options, callback ) {
            var old = {};

            // Remember the old values, and insert the new ones
            for ( var name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }

            callback.call( elem );

            // Revert the old values
            for ( var name in options ) {
                elem.style[ name ] = old[ name ];
            }
        }
    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            var width = elem.offsetWidth, height = elem.offsetHeight,
                skip = elem.nodeName.toLowerCase() === "tr";

            return width === 0 && height === 0 && !skip ?
                true :
                width > 0 && height > 0 && !skip ?
                    false :
                    jQuery.curCSS(elem, "display") === "none";
        };

        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    };

    /*
     ajax可以很麻烦, 也可以很简单的四部;
     */
    var jsc = now(),
        rscript = /<script(.|\s)*?\/script>/gi,
        rselectTextarea = /select|textarea/i,
        rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
        jsre = /=\?(&|$)/,
        rquery = /\?/,
        rts = /(\?|&)_=.*?(&|$)/,
        rurl = /^(\w+:)?\/\/([^\/?#]+)/,
        r20 = /%20/g;

    jQuery.fn.extend({
        // Keep a copy of the old load
        _load: jQuery.fn.load,

        load: function( url, params, callback ) {
            if ( typeof url !== "string" ) {
                return this._load( url );

                // Don't do a request if no elements are being requested
            } else if ( !this.length ) {
                return this;
            }

            var off = url.indexOf(" ");
            if ( off >= 0 ) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off);
            }

            // Default to a GET request
            var type = "GET";

            // If the second parameter was provided
            if ( params ) {
                // If it's a function
                if ( jQuery.isFunction( params ) ) {
                    // We assume that it's the callback
                    callback = params;
                    params = null;

                    // Otherwise, build a param string
                } else if ( typeof params === "object" ) {
                    params = jQuery.param( params, jQuery.ajaxSettings.traditional );
                    type = "POST";
                }
            }

            // Request the remote document
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                context:this,
                complete: function( res, status ) {
                    // If successful, inject the HTML into all the matched elements
                    if ( status === "success" || status === "notmodified" ) {
                        // See if a selector was specified
                        this.html( selector ?
                            // Create a dummy div to hold the results
                            jQuery("<div />")
                                // inject the contents of the document in, removing the scripts
                                // to avoid any 'Permission Denied' errors in IE
                                .append(res.responseText.replace(rscript, ""))

                                // Locate the specified elements
                                .find(selector) :

                            // If not, just inject the full result
                            res.responseText );
                    }

                    if ( callback ) {
                        this.each( callback, [res.responseText, status, res] );
                    }
                }
            });

            return this;
        },

        //根据name和value序列化;
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        //序列化成Object
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
                .filter(function() {
                    return this.name && !this.disabled &&
                        (this.checked || rselectTextarea.test(this.nodeName) ||
                            rinput.test(this.type));
                })
                .map(function( i, elem ) {
                    var val = jQuery(this).val();

                    return val == null ?
                        null :
                        jQuery.isArray(val) ?
                            jQuery.map( val, function( val, i ) {
                                return { name: elem.name, value: val };
                            }) :
                        { name: elem.name, value: val };
                }).get();
        }
    });

//我就感觉这东西没麻用处..
// Attach a bunch of functions for handling common AJAX events
    jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
        jQuery.fn[o] = function( f ) {
            return this.bind(o, f);
        };
    });

    jQuery.extend({

        get: function( url, data, callback, type ) {
            // shift arguments if data argument was omited
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = null;
            }

            return jQuery.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        getScript: function( url, callback ) {
            return jQuery.get(url, null, callback, "script");
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get(url, data, callback, "json");
        },

        post: function( url, data, callback, type ) {
            // shift arguments if data argument was omited
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = {};
            }

            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        ajaxSetup: function( settings ) {
            jQuery.extend( jQuery.ajaxSettings, settings );
        },

        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            /*
             timeout: 0,
             data: null,
             username: null,
             password: null,
             traditional: false,
             */
            // Create the request object; Microsoft failed to properly
            // implement the XMLHttpRequest in IE7 (can't request local files),
            // so we use the ActiveXObject when it is available
            // This function can be overriden by calling jQuery.ajaxSetup
            //如果是本地协议的话为假, IE7或者标准浏览器 //IE7挂了,标准的为真..
            xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
                function() {
                    return new window.XMLHttpRequest();
                } :
                function() {
                    try {
                        return new window.ActiveXObject("Microsoft.XMLHTTP");
                    } catch(e) {}
                },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        /*jQuery1.4的ajax还是写在一块的;
         var xhr = new XMLHttpRequest;
         xhr.open(METHOD, URL, sync);
         xhr.onreadystatechange;
         xhr.setRequestHeader();
         xhr.send();
         */

        /*
         dataType 的参数;
         "xml": 返回 XML 文档，可用 jQuery 处理。
         "html": 返回纯文本 HTML 信息；包含的 script 标签会在插入 dom 时执行。
         "script": 返回纯文本 JavaScript 代码。不会自动缓存结果。除非设置了 "cache" 参数。注意：在远程请求时(不在同一个域下)，所有 POST 请求都将转为 GET 请求。（因为将使用 DOM 的 script标签来加载）
         "json": 返回 JSON 数据 。
         "jsonp": JSONP 格式。使用 JSONP 形式调用函数时，如 "myurl?callback=?" jQuery 将自动替换 ? 为正确的函数名，以执行回调函数。
         "text": 返回纯文本字符串
         */
        ajax: function( origSettings ) {
            var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);

            var jsonp, status, data,
                callbackContext = s.context || s,
                type = s.type.toUpperCase();

            // convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                //序列化的一种;
                s.data = jQuery.param( s.data, s.traditional );
            }

            //处理jsonp的参数;

            // Handle JSONP Parameter Callbacks
            //jsre  === /=\?(&|$)/;
            if ( s.dataType === "jsonp" ) {
                if ( type === "GET" ) {
                    if ( !jsre.test( s.url ) ) {
                        s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
                    }
                } else if ( !s.data || !jsre.test(s.data) ) {
                    s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
                };
                s.dataType = "json";
            };

            // Build temporary JSONP function
            if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
                jsonp = s.jsonpCallback || ("jsonp" + jsc++);

                // Replace the =? sequence both in the query string and the data
                if ( s.data ) {
                    s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
                }

                s.url = s.url.replace(jsre, "=" + jsonp + "$1");

                // We need to make sure
                // that a JSONP style response is executed properly
                s.dataType = "script";

                // Handle JSONP-style loading
                //处理jsonp的回调;
                window[ jsonp ] = window[ jsonp ] || function( tmp ) {
                    data = tmp;
                    success();
                    complete();
                    // Garbage collect
                    window[ jsonp ] = undefined;

                    try {
                        delete window[ jsonp ];
                    } catch(e) {}

                    if ( head ) {
                        head.removeChild( script );
                    }
                };
            };

            if ( s.dataType === "script" && s.cache === null ) {
                s.cache = false;
            }

            if ( s.cache === false && type === "GET" ) {
                var ts = now();

                // try replacing _= if it is there
                var ret = s.url.replace(rts, "$1_=" + ts + "$2");

                // if nothing was replaced, add timestamp to the end
                s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
            }

            //get的方式设置请求头;
            // If data is available, append data to url for get requests
            if ( s.data && type === "GET" ) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
            };

            //触发事件;
            // Watch for a new set of requests
            if ( s.global && ! jQuery.active++ ) {
                jQuery.event.trigger( "ajaxStart" );
            };

            // Matches an absolute URL, and saves the domain
            //exec和test都是正则对象的方法;
            //splice, match, replace, search是字符串的方法;
            var parts = rurl.exec( s.url ),
                remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

            // If we're requesting a remote document
            // and trying to load JSON or Script with a GET
            //又是处理jsonp的回调;
            if ( s.dataType === "script" && type === "GET" && remote ) {
                var head = document.getElementsByTagName("head")[0] || document.documentElement;
                var script = document.createElement("script");
                script.src = s.url;
                if ( s.scriptCharset ) {
                    script.charset = s.scriptCharset;
                }

                // Handle Script loading
                if ( !jsonp ) {
                    var done = false;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function() {
                        if ( !done && (!this.readyState ||
                            this.readyState === "loaded" || this.readyState === "complete") ) {
                            done = true;
                            success();
                            complete();

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;
                            if ( head && script.parentNode ) {
                                head.removeChild( script );
                            }
                        }
                    };
                }

                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used (#2709 and #4378).
                head.insertBefore( script, head.firstChild );

                // We handle everything using the script element injection
                return undefined;
            };

            var requestDone = false;

            // Create the request object
            var xhr = s.xhr();

            if ( !xhr ) {
                return;
            }

            // Open the socket
            // Passing null username, generates a login popup on Opera (#2865)
            if ( s.username ) {
                xhr.open(type, s.url, s.async, s.username, s.password);
            } else {
                xhr.open(type, s.url, s.async);
            }

            // Need an extra try/catch for cross domain requests in Firefox 3
            try {
                // Set the correct header, if data is being sent
                if ( s.data || origSettings && origSettings.contentType ) {
                    //设置请求头的内容类型;
                    xhr.setRequestHeader("Content-Type", s.contentType);
                };

                //设置请求头的缓存;
                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if ( s.ifModified ) {
                    if ( jQuery.lastModified[s.url] ) {
                        xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
                    }

                    if ( jQuery.etag[s.url] ) {
                        xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
                    }
                }

                // Set header so the called script knows that it's an XMLHttpRequest
                // Only send the header if it's not a remote XHR
                if ( !remote ) {
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                }

                // Set the Accepts header for the server, depending on the dataType
                xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
                    s.accepts[ s.dataType ] + ", */*" :
                    s.accepts._default );
            } catch(e) {}

            // Allow custom headers/mimetypes and early abort
            // 如果发送事件返回值不正确, 就会触发ajaxStop, 并返回;
            if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active ) {
                    jQuery.event.trigger( "ajaxStop" );
                }

                // close opended socket
                xhr.abort();
                return false;
            }

            if ( s.global ) {
                trigger("ajaxSend", [xhr, s]);
            }

            // Wait for a response to come back
            var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
                // The request was aborted
                if ( !xhr || xhr.readyState === 0 ) {
                    // Opera doesn't call onreadystatechange before this point
                    // so we simulate the call
                    if ( !requestDone ) {
                        complete();
                    }

                    requestDone = true;
                    if ( xhr ) {
                        xhr.onreadystatechange = jQuery.noop;
                    }

                    // The transfer is complete and the data is available, or the request timed out
                } else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
                    requestDone = true;
                    xhr.onreadystatechange = jQuery.noop;

                    status = isTimeout === "timeout" ?
                        "timeout" :
                        !jQuery.httpSuccess( xhr ) ?
                            "error" :
                            s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
                                "notmodified" :
                                "success";

                    if ( status === "success" ) {
                        // Watch for, and catch, XML document parse errors
                        try {
                            // process the data (runs the xml through httpData regardless of callback)
                            data = jQuery.httpData( xhr, s.dataType, s );
                        } catch(e) {
                            status = "parsererror";
                        }
                    }

                    // Make sure that the request was successful or notmodified
                    if ( status === "success" || status === "notmodified" ) {
                        // JSONP handles its own success callback
                        if ( !jsonp ) {
                            success();
                        }
                    } else {
                        jQuery.handleError(s, xhr, status);
                    }

                    // Fire the complete handlers
                    complete();

                    if ( isTimeout === "timeout" ) {
                        xhr.abort();
                    }

                    // Stop memory leaks
                    if ( s.async ) {
                        xhr = null;
                    }
                }
            };

            // Override the abort handler, if we can (IE doesn't allow it, but that's OK)
            // Opera doesn't fire onreadystatechange at all on abort
            try {
                var oldAbort = xhr.abort;
                xhr.abort = function() {
                    if ( xhr ) {
                        oldAbort.call( xhr );
                        if ( xhr ) {
                            xhr.readyState = 0;
                        }
                    }

                    onreadystatechange();
                };
            } catch(e) { }

            // Timeout checker
            if ( s.async && s.timeout > 0 ) {
                setTimeout(function() {
                    // Check to see if the request is still happening
                    if ( xhr && !requestDone ) {
                        onreadystatechange( "timeout" );
                    }
                }, s.timeout);
            }

            // Send the data
            try {
                xhr.send( type === "POST" || type === "PUT" || type === "DELETE" ? s.data : null );
            } catch(e) {
                jQuery.handleError(s, xhr, null, e);
                // Fire the complete handlers
                complete();
            }

            // firefox 1.5 doesn't fire statechange for sync requests
            if ( !s.async ) {
                onreadystatechange();
            }

            function success() {
                // If a local callback was specified, fire it and pass it the data
                if ( s.success ) {
                    s.success.call( callbackContext, data, status, xhr );
                }

                // Fire the global callback
                if ( s.global ) {
                    trigger( "ajaxSuccess", [xhr, s] );
                }
            }

            function complete() {
                // Process result
                if ( s.complete ) {
                    s.complete.call( callbackContext, xhr, status);
                }

                // The request was completed
                if ( s.global ) {
                    trigger( "ajaxComplete", [xhr, s] );
                }

                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active ) {
                    jQuery.event.trigger( "ajaxStop" );
                }
            }

            function trigger(type, args) {
                (s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
            }

            // return XMLHttpRequest to allow aborting the request etc.
            return xhr;
        },

        handleError: function( s, xhr, status, e ) {
            // If a local callback was specified, fire it
            if ( s.error ) {
                s.error.call( s.context || window, xhr, status, e );
            }

            // Fire the global callback
            if ( s.global ) {
                (s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
            }
        },

        // Counter for holding the number of active queries
        active: 0,

        // Determines if an XMLHttpRequest was successful or not
        httpSuccess: function( xhr ) {
            try {
                // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
                return !xhr.status && location.protocol === "file:" ||
                    // Opera returns 0 when status is 304
                    ( xhr.status >= 200 && xhr.status < 300 ) ||
                    xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
            } catch(e) {}

            return false;
        },

        // Determines if an XMLHttpRequest returns NotModified
        httpNotModified: function( xhr, url ) {
            var lastModified = xhr.getResponseHeader("Last-Modified"),
                etag = xhr.getResponseHeader("Etag");

            if ( lastModified ) {
                jQuery.lastModified[url] = lastModified;
            }

            if ( etag ) {
                jQuery.etag[url] = etag;
            }

            // Opera returns 0 when status is 304
            return xhr.status === 304 || xhr.status === 0;
        },

        httpData: function( xhr, type, s ) {
            var ct = xhr.getResponseHeader("content-type") || "",
                xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if ( xml && data.documentElement.nodeName === "parsererror" ) {
                throw "parsererror";
            }

            // Allow a pre-filtering function to sanitize the response
            // s is checked to keep backwards compatibility
            if ( s && s.dataFilter ) {
                data = s.dataFilter( data, type );
            }

            // The filter can actually parse the response
            if ( typeof data === "string" ) {
                // Get the JavaScript object, if JSON is used.
                if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
                    // Make sure the incoming data is actual JSON
                    // Logic borrowed from http://json.org/json2.js
                    if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

                        // Try to use the native JSON parser first
                        if ( window.JSON && window.JSON.parse ) {
                            data = window.JSON.parse( data );

                        } else {
                            data = (new Function("return " + data))();
                        }

                    } else {
                        throw "Invalid JSON: " + data;
                    }

                    // If the type is "script", eval it in global context
                } else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
                    jQuery.globalEval( data );
                }
            }

            return data;
        },

        // Serialize an array of form elements or a set of
        // key/values into a query string
        //序列化纯对象a, 如果是jq对象会把每一个元素的name和value拼在一起;
        param: function( a, traditional ) {

            var s = [];

            // Set traditional to true for jQuery <= 1.3.2 behavior.
            if ( traditional === undefined ) {
                traditional = jQuery.ajaxSettings.traditional;
            }

            function add( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction(value) ? value() : value;
                s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }

            // If an array was passed in, assume that it is an array of form elements.
            if ( jQuery.isArray(a) || a.jquery ) {
                // Serialize the form elements
                jQuery.each( a, function() {
                    add( this.name, this.value );
                });

            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                jQuery.each( a, function buildParams( prefix, obj ) {

                    if ( jQuery.isArray(obj) ) {
                        // Serialize array item.
                        jQuery.each( obj, function( i, v ) {
                            if ( traditional ) {
                                // Treat each array item as a scalar.
                                add( prefix, v );
                            } else {
                                // If array item is non-scalar (array or object), encode its
                                // numeric index to resolve deserialization ambiguity issues.
                                // Note that rack (as of 1.0.0) can't currently deserialize
                                // nested arrays properly, and attempting to do so may cause
                                // a server error. Possible fixes are to modify rack's
                                // deserialization algorithm or to provide an option or flag
                                // to force array serialization to be shallow.
                                buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
                            }
                        });

                    } else if ( !traditional && obj != null && typeof obj === "object" ) {
                        // Serialize object item.
                        jQuery.each( obj, function( k, v ) {
                            buildParams( prefix + "[" + k + "]", v );
                        });

                    } else {
                        // Serialize scalar item.
                        add( prefix, obj );
                    }
                });
            }

            // Return the resulting serialization
            return s.join("&").replace(r20, "+");
        }

    });

    var elemdisplay = {},
        rfxtypes = /toggle|show|hide/,
    //          开头可以是 += 或 -= 
    //第二个子项可为一个数字或者+,或者减或者是.(出了换行外的任意字符)
    //第三个子项就是剩下的东西;
        rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
        timerId,
        fxAttrs = [
            //slide的height话就是把每一个有关height的属性都要慢慢变少
            // height animations
            [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
            // width animations
            [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
            // opacity animations
            [ "opacity" ]
        ];

    jQuery.fn.extend({
        show: function( speed, callback ) {
            //有速度的话就是慢慢的显示;
            if ( speed != null ) {
                return this.animate( genFx("show", 3), speed, callback);

                //单纯的现实和隐藏;
            } else {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    //第一次这个肯定为undefined的;
                    var old = jQuery.data(this[i], "olddisplay");

                    //css只有生效的时候才附加上去;
                    this[i].style.display = old || "";


                    //如果是隐藏的话, 获取默认的display显示值;
                    if ( jQuery.css(this[i], "display") === "none" ) {
                        var nodeName = this[i].nodeName, display;

                        if ( elemdisplay[ nodeName ] ) {
                            display = elemdisplay[ nodeName ];

                        } else {

                            //获取最初的display值, 并缓存到elemDisplay里面;
                            var elem = jQuery("<" + nodeName + " />").appendTo("body");

                            display = elem.css("display");

                            if ( display === "none" ) {
                                display = "block";
                            };

                            elem.remove();

                            elemdisplay[ nodeName ] = display;
                        };

                        //把这个值保存起来;
                        jQuery.data(this[i], "olddisplay", display);
                    };
                };

                // Set the display of the elements in a second loop
                // to avoid the constant reflow
                for ( var j = 0, k = this.length; j < k; j++ ) {
                    this[j].style.display = jQuery.data(this[j], "olddisplay") || "";
                }

                return this;
            }
        },


        hide: function( speed, callback ) {
            if ( speed != null ) {
                return this.animate( genFx("hide", 3), speed, callback);

            } else {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    var old = jQuery.data(this[i], "olddisplay");
                    //
                    if ( !old && old !== "none" ) {
                        //保存olddisplay, 方便进行toggle;
                        jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
                    }
                }

                // Set the display of the elements in a second loop
                // to avoid the constant reflow
                for ( var j = 0, k = this.length; j < k; j++ ) {
                    this[j].style.display = "none";
                }

                return this;
            }
        },

        // Save the old toggle function
        _toggle: jQuery.fn.toggle,

        toggle: function( fn, fn2 ) {
            var bool = typeof fn === "boolean";

            if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
                this._toggle.apply( this, arguments );

            } else if ( fn == null || bool ) {
                this.each(function() {
                    var state = bool ? fn : jQuery(this).is(":hidden");
                    jQuery(this)[ state ? "show" : "hide" ]();
                });

            } else {
                this.animate(genFx("toggle", 3), fn, fn2);
            }

            return this;
        },

        fadeTo: function( speed, to, callback ) {
            return this.filter(":hidden").css("opacity", 0).show().end()
                .animate({opacity: to}, speed, callback);
        },

        //往fxqueue里面放function;
        /*
         $("body").queue(function(){
         console.log(1);
         console.log(this);
         $(this).dequeue()
         }).
         queue(function(){
         console.log(2)
         });
         */
        animate: function( prop, speed, easing, callback ) {
            /*optall里面有的东西分别是:
             complete: function() {},
             duration: 3000,
             old: false

             complete 是什么东西 , 他会执行dequeue, 让下一个fxqueue执行;
             function () {
             if ( opt.queue !== false ) {
             jQuery(this).dequeue();
             }
             if ( jQuery.isFunction( opt.old ) ) {
             opt.old.call( this );
             }
             }
             */
            var optall = jQuery.speed(speed, easing, callback);

            //如果没有的话直接执行回调的complete方法;
            if ( jQuery.isEmptyObject( prop ) ) {
                return this.each( optall.complete );
            };

            //默认把当前的添加到queue队列, 如果queue只有一个就会执行第一个;
            return this[ optall.queue === false ? "each" : "queue" ](function() {
                var opt = jQuery.extend({}, optall),
                    p,
                //this时选中的原生节点
                    hidden = this.nodeType === 1 && jQuery(this).is(":hidden"),
                    self = this;

                //这个for循环主要处理参数;
                for ( p in prop ) {
                    //css的属性要转驼峰;
                    var name = p.replace(rdashAlpha, fcamelCase);

                    //覆写原来的属性名;
                    if ( p !== name ) {
                        prop[ name ] = prop[ p ];
                        delete prop[ p ];
                        p = name;
                    };

                    //直接跑dequeue队列?
                    if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
                        return opt.complete.call(this);
                    };

                    if ( ( p === "height" || p === "width" ) && this.style ) {
                        //保存原来的display属性和overflow属性;
                        // Store display property
                        opt.display = jQuery.css(this, "display");

                        // Make sure that nothing sneaks out
                        opt.overflow = this.style.overflow;
                    };

                    //可以为这个属性单独设置动画;
                    //{left : ["100px", "swing"]}
                    if ( jQuery.isArray( prop[p] ) ) {
                        // Create (if needed) and add to specialEasing
                        (opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
                        prop[p] = prop[p][0];
                    };
                };

                //默认都回加上 overflow hidden属性吗, 这样好吗, 作用应该是触发元素的layout;
                if ( opt.overflow != null ) {
                    this.style.overflow = "hidden";
                };

                //设置属性;
                opt.curAnim = jQuery.extend({}, prop);

                //迭代每一个需要变化的属性, 调用各自的变化流程函数;
                jQuery.each( prop, function( name, val ) {
                    /*
                     what is jQuery.fx ?
                     function ( elem, options, prop ) {
                     this.options = options;
                     this.elem = elem;
                     this.prop = prop;

                     if ( !options.orig ) {
                     options.orig = {};
                     }
                     };
                     有几个原型属性, 分别是
                     cur,
                     custom,
                     hide,
                     show,
                     step,
                     update;
                     */
                    //e 保存了当前的元素, 当前需要变化的属性, 需要变化的时间等配置的属性, 
                    /*
                     如:
                     elem : body,
                     options : {
                     complete : fn() {},
                     curAnim : {},
                     display : "block",
                     duration : 3000,
                     old : false,
                     orig : {},
                     overflow : ""
                     },
                     prop : "height"
                     */

                    //
                    var e = new jQuery.fx( self, opt, name );

                    // rfxtypes === /toggle|show|hide/;
                    //单独处理显示和隐藏的属性;
                    if ( rfxtypes.test(val) ) {
                        /* 这样看清楚点, 意思就是toggle根据当前元素设置show或者hide, 
                         如果是show还是show, 如果是hide还是hide;
                         e[ val === "toggle" ?
                         (hidden ? "show" : "hide") : val ]( prop );
                         */
                        e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

                    } else {

                        //下面的一大段是计算属性要达到的结果, 处理 px, em, pt单位等兼容;


                        //rfxnum === /^([+-]=)?([\d+-.]+)(.*)$/

                        //exec没有匹配到会返回空;
                        var parts = rfxnum.exec(val),
                        /*
                         //获取值, cur是为animate特别封装的方法;
                         function ( force ) {
                         if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
                         return this.elem[ this.prop ];
                         }

                         var r = parseFloat(jQuery.css(this.elem, this.prop, force));
                         return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
                         }
                         */
                            start = e.cur(true) || 0;

                        // 可能有匹配到数字或者字体单位;
                        // 没有匹配到值不知道是哪些情况;
                        if ( parts ) {
                            //匹配到要达到的值;
                            var end = parseFloat( parts[2] ),
                            //有值得话给值, 否者给个px;
                            //TODO:如果是opacity呢;
                                unit = parts[3] || "px";

                            // We need to compute starting value;
                            // 如果单位为em,% 等什么的..
                            if ( unit !== "px" ) {
                                //设置当前的值;
                                self.style[ name ] = (end || 1) + unit;
                                /*
                                 要达到
                                 ------- = ------
                                 现在的值  开始的值
                                 */
                                start = ((end || 1) / e.cur(true)) * start;
                                self.style[ name ] = start + unit;
                            }

                            // If a +=/-= token was provided, we're doing a relative animation
                            if ( parts[1] ) {
                                /*
                                 除了
                                 -=
                                 剩下的分别为
                                 +=
                                 +
                                 -
                                 */
                                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                            }

                            //e 是运动的实例, 里面有好多方法函数, 专门处理动画的;
                            //unit 是单元, 代表了单位;
                            e.custom( start, end, unit );

                        } else {
                            e.custom( start, val, "" );
                        }
                    }
                });

                // For JS strict compliance
                return true;
            });
        },

        //把当前的queue清空, 而且还会把timers里面跟当前元素有关的动画删除
        stop: function( clearQueue, gotoEnd ) {
            var timers = jQuery.timers;

            //把queue清空了;
            if ( clearQueue ) {
                this.queue([]);
            }

            this.each(function() {
                // go in reverse order so anything added to the queue during the loop is ignored
                for ( var i = timers.length - 1; i >= 0; i-- ) {
                    if ( timers[i].elem === this ) {
                        if (gotoEnd) {
                            // force the next step to be the last
                            timers[i](true);
                        }

                        timers.splice(i, 1);
                    }
                }
            });

            // start the next in the queue if the last step wasn't forced
            if ( !gotoEnd ) {
                this.dequeue();
            }

            return this;
        }

    });

// Generate shortcuts for custom animations
    //each的每一个都形成了一个闭包;
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, callback ) {
            return this.animate( props, speed, callback );
        };
    });

    jQuery.extend({
        speed: function( speed, easing, fn ) {
            var opt = speed && typeof speed === "object" ? speed : {
                complete: fn || !fn && easing ||
                    jQuery.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
                jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

            // Queueing
            opt.old = opt.complete;
            opt.complete = function() {
                if ( opt.queue !== false ) {
                    jQuery(this).dequeue();
                }
                if ( jQuery.isFunction( opt.old ) ) {
                    opt.old.call( this );
                }
            };

            return opt;
        },

        easing: {
            linear: function( p, n, firstNum, diff ) {
                return firstNum + diff * p;
            },
            swing: function( p, n, firstNum, diff ) {
                return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
            }
        },

        timers: [],

        fx: function( elem, options, prop ) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            if ( !options.orig ) {
                options.orig = {};
            }
        }

    });

    jQuery.fx.prototype = {
        // Simple function for setting a style value
        update: function() {
            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            };

            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

            //如果一个元素是隐藏的, jq会把元素显示出来;
            // Set display property to block for height/width animations
            if ( ( this.prop === "height" || this.prop === "width" ) && this.elem.style ) {
                this.elem.style.display = "block";
            };
        },

        // Get the current size
        cur: function( force ) {
            if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
                return this.elem[ this.prop ];
            }

            var r = parseFloat(jQuery.css(this.elem, this.prop, force));
            return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
        },

        // Start an animation from one number to another
        custom: function( from, to, unit ) {
            this.startTime = now();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;

            //保存当前的上下文;
            var self = this;
            function t( gotoEnd ) {
                //这个闭包里面有一个闭包;
                return self.step(gotoEnd);
            }

            t.elem = this.elem;
            //又一个闭包,保存到timers里面去, timerId 是上上上个函数定义的;
            if ( t() && jQuery.timers.push(t) && !timerId ) {
                //定时器就走一次;
                timerId = setInterval(jQuery.fx.tick, 13);
            }
        },

        // Simple 'show' function
        show: function() {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
            this.options.show = true;

            // Begin the animation
            // Make sure that we start at a small width/height to avoid any
            // flash of content
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

            // Start by showing the element
            jQuery( this.elem ).show();
        },

        // Simple 'hide' function
        hide: function() {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
            this.options.hide = true;

            // Begin the animation
            this.custom(this.cur(), 0);
        },

        // Each step of an animation
        step: function( gotoEnd ) {
            var t = now(), done = true;

            //时间走完了才走这边;
            //如果现在的时间超过了这个动画要执行的时间
            if ( gotoEnd || t >= this.options.duration + this.startTime ) {
                this.now = this.end;
                this.pos = this.state = 1;

                //把这个属性最终的值设定上面去;
                this.update();

                //把某些属性已经走完毕了;
                this.options.curAnim[ this.prop ] = true;

                for ( var i in this.options.curAnim ) {
                    //如果所有的属性都为ture的话 done就不会是false了
                    if ( this.options.curAnim[i] !== true ) {
                        done = false;
                    };
                };

                //就是善后
                if ( done ) {
                    if ( this.options.display != null ) {
                        // Reset the overflow
                        this.elem.style.overflow = this.options.overflow;

                        // Reset the display
                        var old = jQuery.data(this.elem, "olddisplay");
                        this.elem.style.display = old ? old : this.options.display;

                        if ( jQuery.css(this.elem, "display") === "none" ) {
                            this.elem.style.display = "block";
                        };
                    };

                    // Hide the element if the "hide" operation was done
                    if ( this.options.hide ) {
                        jQuery(this.elem).hide();
                    }

                    // Reset the properties, if the item has been hidden or shown
                    if ( this.options.hide || this.options.show ) {
                        for ( var p in this.options.curAnim ) {
                            jQuery.style(this.elem, p, this.options.orig[p]);
                        }
                    }

                    // 执行下一个dequeue;
                    // Execute the complete function
                    this.options.complete.call( this.elem );
                }

                return false;

            } else {
                //经过的毫秒数;
                var n = t - this.startTime;
                //   经过的毫秒数/所有要用的时间  ==>>  这个是百分比;
                this.state = n / this.options.duration;

                // Perform the easing function, defaults to swing
                var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];

                var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");

                //linear动画函数n(经过的毫秒数)有关系, 但是没有用到;
                //现在经过的时间(0 ==>> 1);
                //经过的毫秒数
                this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);

                //this.now为计算出来的值;
                //开始的值   //要走的路程
                //通过时间根据运动函数算出来的
                this.now = this.start + ((this.end - this.start) * this.pos);

                //把this.now更新到元素的值上面去;
                // Perform the next step of the animation
                this.update();
            }

            return true;
        }
    };

    //为fx原型添加各种方法;
    jQuery.extend( jQuery.fx, {
        tick: function() {
            var timers = jQuery.timers;

            //避免开多个定时器, 影响执行效率;
            //每一个都执行运动队列
            for ( var i = 0; i < timers.length; i++ ) {
                if ( !timers[i]() ) {
                    timers.splice(i--, 1);
                }
            }

            if ( !timers.length ) {
                //把定时器清了,
                //没有清空运动的列表, 如果重新fx.stop()后重新执行 fx.tick()会重新跑;
                jQuery.fx.stop();
            }
        },

        stop: function() {
            //
            clearInterval( timerId );
            timerId = null;
        },

        speeds: {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        },

        step: {
            //渐变的几个属性还是屈指可数的
            opacity: function( fx ) {
                jQuery.style(fx.elem, "opacity", fx.now);
            },

            _default: function( fx ) {
                if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                    //元素的宽和高不可能小于0;
                    fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
                } else {
                    //如果style上没有这个属性, 就把只设置到元素节点属性上面;
                    fx.elem[ fx.prop ] = fx.now;
                }
            }
        }
    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }

    function genFx( type, num ) {
        var obj = {};

        jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
            obj[ this ] = type;
        });

        return obj;
    }

    ;
    /*
     getBoundingClientRect方法最先在IE5中出现, 后来被W3C接纳成为标准.
     目前IE5.5+、Firefox 3.5+、Chrome 4+、Safari 4.0+、Opara 10.10+等浏览器均支持该方法, 兼容性几乎完美
     */
    if ( "getBoundingClientRect" in document.documentElement ) {
        jQuery.fn.offset = function( options ) {
            //elem为当前的jQ对象第一个元素;
            var elem = this[0];

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            //设置
            if ( options ) {
                return this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
            }

            if ( elem === elem.ownerDocument.body ) {

                //单独处理body的top和left;
                return jQuery.offset.bodyOffset( elem );
            };

            //getBoundingClientRect获取的left和top是不包含margin的;
            var box = elem.getBoundingClientRect(),
            //这样可以实现跨iframe获取值;
                doc = elem.ownerDocument,
                body = doc.body,
                docElem = doc.documentElement,

            //IE768下有2px的border;
                clientTop = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,

                top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
                left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

            return { top: top, left: left };
        };

    } else {
        jQuery.fn.offset = function( options ) {
            var elem = this[0];

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            if ( options ) {
                return this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
            }

            if ( elem === elem.ownerDocument.body ) {
                return jQuery.offset.bodyOffset( elem );
            }

            jQuery.offset.initialize();

            var offsetParent = elem.offsetParent, prevOffsetParent = elem,
                doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
                body = doc.body, defaultView = doc.defaultView,
                prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
                top = elem.offsetTop, left = elem.offsetLeft;

            while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
                if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                top  -= elem.scrollTop;
                left -= elem.scrollLeft;

                if ( elem === offsetParent ) {
                    top  += elem.offsetTop;
                    left += elem.offsetLeft;

                    if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
                        top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                        left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                    }

                    prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
                }

                if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
                    top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                    left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
                top  += body.offsetTop;
                left += body.offsetLeft;
            }

            if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                top  += Math.max( docElem.scrollTop, body.scrollTop );
                left += Math.max( docElem.scrollLeft, body.scrollLeft );
            }

            return { top: top, left: left };
        };
    }

    //这些都是定义在jQ工具元素的offset上面的;
    jQuery.offset = {
        initialize: function() {
            var body = document.body,
                container = document.createElement("div"),
                innerDiv,
                checkDiv,
                table,
                td,
                bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true) ) || 0,
                html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            /*
             <div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'>
             <div>
             </div>
             </div>
             <table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'
             cellpadding='0' cellspacing='0'>
             <tr>
             <td>
             </td>
             </tr>
             </table>
             */
            //尼玛, 第一次见到这样设置style的;
            jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

            container.innerHTML = html;
            body.insertBefore( container, body.firstChild );
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;

            this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

            checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
            // safari subtracts parent border width here which is 5px
            this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
            checkDiv.style.position = checkDiv.style.top = "";

            innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
            this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

            body.removeChild( container );
            body = container = innerDiv = checkDiv = table = td = null;
            jQuery.offset.initialize = jQuery.noop;
        },

        bodyOffset: function( body ) {
            var top = body.offsetTop, left = body.offsetLeft;

            //这只执行一次检测兼容的函数;
            //
            jQuery.offset.initialize();

            //根据上面的函数得到的值; IE7,IE6为false, 标准浏览器下为真;
            if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
                top  += parseFloat( jQuery.curCSS(body, "marginTop",  true) ) || 0;
                left += parseFloat( jQuery.curCSS(body, "marginLeft", true) ) || 0;
            }

            // offset是从border-box开始的(不包含border);
            // 不要忘记了这个返回的top, left 和 position:absolute设置的top,left不一样的
            return { top: top, left: left };
        },

        setOffset: function( elem, options, i ) {
            // set position first, in-case top/left are set even on static elem
            //如果当前的元素的定位为默认的static 就改成相对定位, 
            if ( /static/.test( jQuery.curCSS( elem, "position" ) ) ) {
                elem.style.position = "relative";
            };

            //获取默认的数据;
            var curElem   = jQuery( elem ),
            //curOffset为相对当前父级的top和left;
                curOffset = curElem.offset(),

            //position 的left和top;
                curTop    = parseInt( jQuery.curCSS( elem, "top",  true ), 10 ) || 0,
                curLeft   = parseInt( jQuery.curCSS( elem, "left", true ), 10 ) || 0;

            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            };

            //这个设置的是offset, 所以要根据curTop进行计算;
            var props = {
                //要设置的值    相对当前的offset的值
                                                          //定位给的值
                top:  (options.top  - curOffset.top)  + curTop,
                left: (options.left - curOffset.left) + curLeft
            };

            //
            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };


    //获取相对当前有相对或者绝对定位的父级;
    jQuery.fn.extend({
        position: function() {
            if ( !this[0] ) {
                return null;
            }

            var elem = this[0],

            // Get *real* offsetParent
                offsetParent = this.offsetParent(),

            // Get correct offsets
                offset       = this.offset(),
            //如果是html或者body标签就把父级单位值设置为 0, 0;
                parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            //当前的offset是不包含margin的..
            offset.top  -= parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) || 0;
            offset.left -= parseFloat( jQuery.curCSS(elem, "marginLeft", true) ) || 0;

            // Add offsetParent borders
            parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) ) || 0;
            parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], "borderLeftWidth", true) ) || 0;

            // Subtract the two offsets
            return {
                //当前要计算出来的值为这个元素的margin开始到有定位元素的padding-box, 所以当前元素要减去一个margin, 再减去父级元素要的border;
                //top =  offset.top - 
                //    parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) - 
                //    parentOffset.top - 
                //    parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) );
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.body;
                while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent;
            });
        }
    });


//each这里面也是闭包;
// Create scrollLeft and scrollTop methods
    jQuery.each( ["Left", "Top"], function( i, name ) {
        var method = "scroll" + name;

        //scrollLeft 和 scorllTop,
        jQuery.fn[ method ] = function(val) {
            var elem = this[0], win;

            if ( !elem ) {
                return null;
            }

            if ( val !== undefined ) {
                // Set the scroll offset
                return this.each(function() {
                    //判断当前这个元素是否是window
                    win = getWindow( this );

                    if ( win ) {
                        win.scrollTo(
                            //如果是执行scollLeft那么 i就是false ,!i=== true:
                            //  scrollLeft为给定的值, scrollTop还是原来的值;
                            !i ? val : jQuery(win).scrollLeft(),
                            i ? val : jQuery(win).scrollTop()
                        );

                    } else {
                        this[ method ] = val;
                    }
                });
            } else {
                //判断当前这个元素是否是window
                win = getWindow( elem );

                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                    // W3正常的盒模型;
                    jQuery.support.boxModel && win.document.documentElement[ method ] ||
                        win.document.body[ method ] :
                    elem[ method ];
            }
        };
    });

    function getWindow( elem ) {
        return ("scrollTo" in elem && elem.document) ?
            //直接判断为window
            elem :
            //doc文档类型的也要返回window,
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }
// 又each了几个闭包出来, 很多闭包,
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
    jQuery.each([ "Height", "Width" ], function( i, name ) {

        var type = name.toLowerCase();

        // innerHeight and innerWidth
        jQuery.fn["inner" + name] = function() {
            return this[0] ?
                //反正是依赖css方法, 返回的是padding+width或者 padding+height;
                jQuery.css( this[0], type, false, "padding" ) :
                null;
        };

        // outerHeight and outerWidth
        //默认返回borderbox 的width或者height,如果给个真就返回包含margin的width或者height;
        jQuery.fn["outer" + name] = function( margin ) {
            return this[0] ?
                jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
                null;
        };

        jQuery.fn[ type ] = function( size ) {
            // Get window width or height
            var elem = this[0];
            if ( !elem ) {
                return size == null ? null : this;
            }

            //返回值
                //确认当前的元素是否是window;
                //再判断当前元素是否是document;
            //如果是element元素就要根据元素的值设置或者获取;
            return ("scrollTo" in elem && elem.document) ? // does it walk and quack like a window?
                // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
                //是标准模式
                elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
                    //IE的诡异quirk模式下的值为BackCompat;
                    elem.document.body[ "client" + name ] :

                // Get document width or height
                (elem.nodeType === 9) ? // is it a document
                    // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
                    //滚动的肯定要最大的值, 各个浏览器对这个属性定义的各不相同;
                    Math.max(
                        elem.documentElement["client" + name],
                        elem.body["scroll" + name], elem.documentElement["scroll" + name],
                        elem.body["offset" + name], elem.documentElement["offset" + name]
                    ) :

                    // Get or set width or height on the element
                    size === undefined ?
                        //返回值
                        // Get width or height on the element
                        jQuery.css( elem, type ) :

                        // Set the width or height on the element (default to pixels if value is unitless)
                        this.css( type, typeof size === "string" ? size : size + "px" );
        };

    });
// Expose jQuery to the global object
    window.jQuery = window.$ = jQuery;

})(window);