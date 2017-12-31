(function () {
    'use strict';
    var Util = (function () {
        var prefix = 'ficiton_reader_';
        var StorageGetter = function (key) {
            return localStorage.getItem(prefix + key);
        }
        var StorageSetter = function (key, val) {
            return localStorage.setItem(prefix + key, val);
        }

        //数据解密
        function getJSONP(url, callback) {
            return $.jsonp({
                url: url,
                cache: true,
                callback: "duokan_fiction_chapter",
                success: function (result) {
                    // 解密
                    var data = $.base64.decode(result);
                    // 编码
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            });

        };

        return {
            getJSONP: getJSONP,
            StorageGetter: StorageGetter,
            StorageSetter: StorageSetter
        }
    })();


    //获得阅读器内容的方法
    function ReaderModel(id_, cid_, onChange_) {

        var Fiction_id = id_; // 书籍id

        var Chapter_id = cid_; // 章节id

        var toc; // 存放章节数目
        //
        /*if (Util.StorageGetter(Fiction_id + '_last_chapter')) {
            Chapter_id = Util.StorageGetter(Fiction_id + '_last_chapter');
        }*/

        /*if (!Chapter_id) {
            Chapter_id = 1;
        }*/
        var Chapters = []; // 存放章节内容(全局)

        var init = function () {
            getFictionInfoPromise.then(function (d) {
                gotoChapter(Chapter_id);
            });
        };

        var gotoChapter = function (chapter_id) {
            Chapter_id = chapter_id;
            getCurChapterContent(onChange_);
        }

        //获得当前章节内容
        var getCurChapterContent = function (onChange) {
            $.get("/ajax/chapter_datas", {
                fiction_id: Fiction_id,
                chapter_id: Chapter_id
            }, function (data) {
                $('#init_loading').hide();
                if (data.result == 0) {
                    // 设置已读章节
                    Util.StorageSetter(Fiction_id + '_last_chapter', Chapter_id);

                    var url = data.url;
                    Util.getJSONP(url, function (data) {
                        setTimeout(function () {
                            $('#loading').hide().html('正在加载中...');
                            $('#Tag__pro').html((Chapter_id + 1) + '/' + toc.length);
                        }, 500);
                        // console.log( typeof data)
                        var content = JSON.parse(data);
                        content.sure = true;
                        onChange && onChange(content);
                    });
                } else {
                    $('#loading').show().html('暂无数据');
                    onChange && onChange({
                        t: toc[Chapter_id].title,
                        p: ["暂无书籍详情..."],
                        sure: false
                    });
                }
            }, 'json');
            return;
        };

        // 获取章节详细信息 返回Promise
        var getFictionInfoPromise = new Promise(function (resolve, reject) {
            $.ajax({
                url: '/ajax/chapters',
                type: 'get',
                data: {
                    fiction_id: Fiction_id
                },
                dataType: 'json',
                success: function (res) {
                    if (res.result == 0) {
                        toc = res.item.toc;
                        // $('#nav_title').html('返回');
                        $('#Tag__pro').html((Chapter_id + 1) + '/' + toc.length);
                        for (var i = 0; i < toc.length; i++) {
                            Chapters.push({
                                "chapter_id": toc[i].chapter_id,
                                "title": toc[i].title
                            });
                        }
                        resolve(Chapters);
                        Util.StorageSetter(Fiction_id + '_toc', JSON.stringify(toc));
                        // console.log(JSON.stringify(Chapters))
                    } else {
                        reject(res);
                    }
                },
                error: function (e) {

                }
            });
        })


        //获得上一章内容
        var prevChapter = function () {
            Chapter_id = parseInt(Chapter_id);
            if (Chapter_id == 0) {
                return
            }
            Chapter_id--;
            gotoChapter(Chapter_id);
            // 设置已读的章节id
            // Util.StorageSetter(Fiction_id + '_last_chapter', Chapter_id);
        };

        //获得下一章内容
        var nextChapter = function () {
            Chapter_id = parseInt(Chapter_id);
            if (Chapter_id == Chapters.length - 1) {
                return
            }
            Chapter_id++;
            gotoChapter(Chapter_id);
            // 设置已读的章节id
            // Util.StorageSetter(Fiction_id + '_last_chapter', Chapter_id);
        };

        // 获取文章详情
        var getChapter = function (callback) {
            Chapter_id = parseInt(Chapter_id);
            if (Chapter_id == Chapters.length - 1) {
                return
            }
            Chapter_id++;
            getCurChapterContent(function (data) {
                var RootContainer = $('#fiction_container')
                var content = RootContainer.html();
                // debugger
                RenderBaseFrame(RootContainer)(content, data);
                data.sure == true ? callback && callback(true) : (callback && callback(false), Chapter_id--);
            });
            // 设置已读的章节id
            // Util.StorageSetter(Fiction_id + '_last_chapter', Chapter_id);
        };
        return {
            init: init,
            go: gotoChapter,
            prev: prevChapter,
            next: nextChapter,
            getChapter_id: function () {
                return Chapter_id;
            },
            getChapter: getChapter
        };
    }

    //画一下基本的展示框架
    function RenderBaseFrame(container) {
        function parseChapterData(content, jsonData) {
            console.log(jsonData)
            // var jsonObj = JSON.parse(jsonData);
            var html = content + "<h4>" + jsonData.t + "</h4>";
            for (var i = 0; i < jsonData.p.length; i++) {
                html += "<p>" + jsonData.p[i] + "</p>";
            }
            return html;
        }

        return function (htmlContent, data) {
            var html = htmlContent || '';
            container.html(parseChapterData(html, data));
        };
    }

    function main() {

        // 显示加载动画
        $('#init_loading').show();

        // 获取fiction_id 和 chapter_id
        var RootContainer = $('#fiction_container');
        var params = {
            fiction_id: parseInt(getUrlStr('fiction_id')),
            chapter_id: parseInt(getUrlStr('chapter_id')),
            from: getUrlStr('from')
        }
        if (!params.fiction_id) {
            history.back(); // 回退到上一级
        }
        var Fiction_id = params.fiction_id, // 全局书籍id
            Chapter_id = JSON.parse(Util.StorageGetter(Fiction_id + '_last_chapter')) || params.chapter_id; // 全局章节id

        // 绑定事件
        var ScrollLock = false; // 锁定滚动条
        var Doc = document;
        var Screen = Doc.body;
        var Win = $(window);

        //是否是夜间模式
        var NightMode = false;

        //初始化的字体大小
        var InitFontSize;

        //dom节点的缓存
        var Dom = {
            bottom_tool_bar: $('#bottom_tool_bar'),
            nav_title: $('#nav_title'),
            bk_container: $('#bk-container'),
            night_button: $('#night-button'),
            next_button: $('#nextchapter'),
            prev_button: $('#prevchapter'),
            back_button: $('#back_button'),
            top_nav: $('#top-nav'),
            bottom_nav: $('.bottom_nav'),
            progress: $('#Tag__pro')
        }

        // 程序初始化
        var readerUIFrame = RenderBaseFrame(RootContainer);

        //获得章节数据，展示
        var readerModel = ReaderModel(Fiction_id || 13359, Chapter_id || 0, function (data) {
            readerUIFrame('', data);
            Dom.bottom_tool_bar.show();
            setTimeout(function () {
                ScrollLock = false;
                Screen.scrollTop = 0;
            }, 20);
        });

        //阅读器数据内容展示
        readerModel.init();

        //从缓存中读取的信息进行展示
        var ModuleFontSwitch = (function () {
            //字体和背景的颜色表
            var colorArr = [{
                value: '#f7eee5',
                name: '米白',
                font: ''
            }, {
                value: '#e9dfc7',
                name: '纸张',
                font: '',
                id: "font_normal"
            }, {
                value: '#a4a4a4',
                name: '浅灰',
                font: ''
            }, {
                value: '#cdefce',
                name: '护眼',
                font: ''
            }, {
                value: '#283548',
                name: '灰蓝',
                font: '#7685a2',
                bottomcolor: '#fff'
            }, {
                value: '#0f1410',
                name: '夜间',
                font: '#4e534f',
                bottomcolor: 'rgba(255,255,255,0.7)',
                id: "font_night"
            }];

            var tool_bar = Util.StorageGetter('toolbar_background_color');
            var bottomcolor = Util.StorageGetter('bottom_color');
            var color = Util.StorageGetter('background_color');
            var font = Util.StorageGetter('font_color');
            var bkCurColor = Util.StorageGetter('background_color') || '#e9dfc7';
            var fontColor = Util.StorageGetter('font_color');

            for (var i = 0; i < colorArr.length; i++) {
                var display = 'none';
                if (bkCurColor == colorArr[i].value) {
                    display = 'block';
                }
                Dom.bk_container.append('<div class="bk-container" id="' + colorArr[i].id + '" data-font="' + colorArr[i].font + '"  data-bottomcolor="' + colorArr[i].bottomcolor + '" data-color="' + colorArr[i].value + '" style="background-color:' + colorArr[i].value + '"><div class="bk-container-current" style="display:' + display + '"></div><span style="display:none">' + colorArr[i].name + '</span></div>');
            }

            RootContainer.css('min-height', $(window).height() - 100);

            if (bottomcolor) {
                $('#bottom_tool_bar_ul').find('li').css('color', bottomcolor);
            }

            if (color) {
                $('body').css('background-color', color);
            }

            if (font) {
                $('.m-read-content').css('color', font);
            }

            //夜间模式
            if (fontColor == '#4e534f') {
                NightMode = true;
                $('#day_icon').show();
                $('#night_icon').hide();
                $('#bottom_tool_bar_ul').css('opacity', '0.6');
            }

            //字体设置信息
            InitFontSize = Util.StorageGetter('font_size');
            InitFontSize = parseInt(InitFontSize);
            if (!InitFontSize) {
                InitFontSize = 18;
            }

            RootContainer.css('font-size', InitFontSize);


            // 默认设置上下工具栏隐藏
            Dom.top_nav.css('opacity', 0).hide();
            Dom.bottom_nav.css('opacity', 0).hide();
        })();


        //页面中的零散交互事件处理
        var EventHandler = (function () {
            //夜间和白天模式的转化
            Dom.night_button.click(function () {
                if (NightMode) {
                    $('#day_icon').hide();
                    $('#night_icon').show();
                    $('#font_normal').trigger('click');
                    NightMode = false;
                } else {
                    $('#day_icon').show();
                    $('#night_icon').hide();
                    $('#font_night').trigger('click');
                    NightMode = true;
                }

            });

            //字体和背景颜色的信息设置
            Dom.bk_container.delegate('.bk-container', 'click', function () {
                var color = $(this).data('color');
                var font = $(this).data('font');
                var bottomcolor = $(this).data('bottomcolor');
                var tool_bar = font;
                Dom.bk_container.find('.bk-container-current').hide();
                $(this).find('.bk-container-current').show();
                if (!font) {
                    font = '#000';
                }
                if (!tool_bar) {
                    tool_bar = '#fbfcfc';
                }

                if (bottomcolor && bottomcolor != "undefined") {
                    $('#bottom_tool_bar_ul').find('li').css('color', bottomcolor);
                } else {
                    $('#bottom_tool_bar_ul').find('li').css('color', '#a9a9a9');
                }
                $('body').css('background-color', color);
                $('.m-read-content').css('color', font);

                Util.StorageSetter('toolbar_background_color', tool_bar);
                Util.StorageSetter('bottom_color', bottomcolor);
                Util.StorageSetter('background_color', color);
                Util.StorageSetter('font_color', font);

                var fontColor = Util.StorageGetter('font_color');
                //夜间模式
                if (fontColor == '#4e534f') {
                    NightMode = true;
                    $('#day_icon').show();
                    $('#night_icon').hide();
                    $('#bottom_tool_bar_ul').css('opacity', '0.6');
                } else {
                    NightMode = false;
                    $('#day_icon').hide();
                    $('#night_icon').show();
                    $('#bottom_tool_bar_ul').css('opacity', '0.9');
                }
            });

            //按钮的多态样式效果
            $('.spe-button').on('touchstart', function () {
                $(this).css('background', 'rgba(255,255,255,0.3)');
            }).on('touchmove', function () {
                $(this).css('background', 'none');
            }).on('touchend', function () {
                $(this).css('background', 'none');
            });

            //字体放大
            $('#large-font').click(function () {
                if (InitFontSize > 24) {
                    return;
                }
                InitFontSize += 1;
                Util.StorageSetter('font_size', InitFontSize);
                RootContainer.css('font-size', InitFontSize);
            });

            //字体缩小
            $('#small-font').click(function () {
                if (InitFontSize < 12) {
                    return;
                }
                InitFontSize -= 1;
                Util.StorageSetter('font_size', InitFontSize);
                RootContainer.css('font-size', InitFontSize);
            });

            var font_container = $('.font-container');
            var font_button = $('#font-button');
            var menu_container = $('#menu_container');
            // 动态设置字体容器的transform
            for (var i = 0; i < font_container.length; i++) {
                font_container.eq(i).css('transform', 'translate3d(0,' + font_container.height() + 'px,0)');
            }
            //  字体设置按钮点击事件
            font_button.click(function () {
                // 获取字体容器的transform值
                var font_container_trasnlated3d = font_container.css('transform').replace(/[^0-9\-,]/g, '').split(',');

                if (font_container_trasnlated3d[1] <= font_container.height() && font_container_trasnlated3d[1] > 0) { // 隐藏
                    // console.log(font_container_trasnlated3d[1])
                    font_button.addClass('current');
                    font_container.css('transform', 'translate3d(0, -' + Dom.bottom_nav.height() + 'px,0)');
                } else if (font_container_trasnlated3d[1] < 0) { // 显示
                    font_button.removeClass('current');
                    font_container.show().css('transform', 'translate3d(0,' + font_container.height() + 'px,0)');
                }
            });

            RootContainer.click(function () {
                font_container.css('transform', 'translate3d(0,' + font_container.height() + 'px,0)');
                font_button.removeClass('current');
            });

            //对屏幕的滚动监控
            Win.scroll(function () {
                Dom.top_nav.css('opacity', 0).hide();
                Dom.bottom_nav.css('opacity', 0).hide();
                font_container.css('transform', 'translate3d(0,' + font_container.height() + 'px,0)');
                font_button.removeClass('current');

                // 监听是否滚到底部
                var scrollTop = scroll().top + windowHeight(),
                    documentheight = documentHeight(),
                    loadDistance = documentheight - scrollTop; // 加载距离
                if (loadDistance <= windowHeight() * 2) {
                    // 当加载到离底部只差一点距离时,
                    //请求新的数据
                    // console.log('windowHeight: ' + windowHeight())
                    // console.log('scrollTop: ' + scroll().top)
                    // console.log('documentHeight: ' + documentHeight())
                    console.log('正在加载中...');
                    if (!ScrollLock) {
                        ScrollLock = true;
                        $('#loading').show();
                        readerModel.getChapter(function (bool) {
                            bool ? ScrollLock = false : ScrollLock = true;
                        });

                    }
                }
            });

            //章节翻页(下一页)
            Dom.next_button.click(function () {
                $('#init_loading').show();
                readerModel.next();
            });

            //章节翻页(上一页)
            Dom.prev_button.click(function () {
                $('#init_loading').show();
                readerModel.prev();
            });


            //返回上级页面
            $('.icon-back').click(function () {
                var from;
                params.from == 'book' ? from = 'main' : from = params.from;
                if (Fiction_id) {
                    if (from == 'categoryDetails') {
                        var cate_id = getUrlStr('cate_id'),
                            nav = getUrlStr('nav');
                        location.href = '/book?id=' + Fiction_id + '&cate_id=' + cate_id + '&nav=' + nav + '&from=' + from;
                        return false;
                    } else if (from == 'shelf') {
                        location.href = '/';
                        return false;
                    }
                    location.href = '/book?id=' + Fiction_id + '&from=' + from;
                }
            });

            //跳转目录
            $('#menu_button').click(function () {
                var from;
                params.from == 'book' ? from = 'main' : from = params.from;
                if (from == 'categoryDetails') {
                    var cate_id = getUrlStr('cate_id'),
                        nav = getUrlStr('nav');
                    location.href = '/chapter?fiction_id=' + Fiction_id + '&chapter_id=' + Chapter_id + '&cate_id=' + cate_id + '&nav=' + nav + '&from=' + from;
                    return false;
                }
                location.href = '/chapter?fiction_id=' + Fiction_id + '&chapter_id=' + Chapter_id + '&from=' + from;//跳转到目录页面
            });

            //屏幕中央事件
            $('#action_mid').click(function () {
                if (Dom.top_nav.css('opacity') == 0) {
                    Dom.top_nav.show().css('opacity', 1);
                    Dom.bottom_nav.show().css('opacity', 1);
                } else {
                    Dom.top_nav.css('opacity', 0).hide();
                    Dom.bottom_nav.css('opacity', 0).hide();
                    font_container.css('transform', 'translate3d(0,' + font_container.height() + 'px,0)');
                    font_button.removeClass('current');
                }
            });

            // 点击移动屏幕(向上)
            $('#action_top').click(function () {
                var height = $(window).height() - 20;
                var scrollTop = scroll().top;
                Screen.scrollTop = Math.max(0, scrollTop - height);
            })
            // 点击移动屏幕(向下)
            $('#action_bottom').click(function () {
                var height = $(window).height() - 20;
                var scrollTop = scroll().top;
                Screen.scrollTop = Math.min(height + scrollTop, documentHeight());
            });

        })();
    }

    return main();
})();