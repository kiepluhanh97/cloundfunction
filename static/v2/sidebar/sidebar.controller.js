(function () {
    'use strict';
    theApp.controller('SidebarController', SidebarController);
    SidebarController.$inject = ['$scope', '$rootScope', '$compile', '$interval', '$location', '$timeout', 'UIVER'];
    function SidebarController($scope, $rootScope, $compile, $interval, $location, $timeout, UIVER) {
        $scope.uiver = UIVER;
        $scope.userName = $rootScope.curentuser.username;
        $scope.userType = $rootScope.curentuser.type;
        $scope.userRule = $rootScope.userRule;
        console.log($scope.userName, $scope.userType);
        //$scope.userName = "Admin";
        $scope.global = $rootScope;
        console.log($scope.global);

        $scope.checkActive = function (item) {
            var path = $location.path();
            var result = false;
            for (var i = 0; i < item.length; i++) {
                if (path == item[i]) {
                    result = true;
                    break;
                }

            }
            return result;
        }

        $scope.checkshow = function (item) {

            var path = $location.path();
            var result = false;
            for (var i = 0; i < item.length; i++) {
                if (path == item[i]) {
                    result = true;
                    break;
                }

            }

            return result;
        }

        $scope.selectMenu = function ($event) {

            $('ul.nav.side-menu').children("li").each(function (i, el) {
                console.log(i, el);
                $(el).removeClass("active");
                if ($(el).children('ul').length) {
                    $(el).children('ul').css('display', 'none');
                }
            });
            console.log($($event.target));
            console.log($($event.target).parent());
            $($event.target).parent().addClass("active");
            var $elem = $($event.target).parent().find("ul");
            $elem.css('display', 'block');
            $('ul.nav.side-menu').children("li").each(function (i, el) {
                console.log(i, el);
            });

        }

        $scope.$watch('$viewContentLoaded', function () {
/*
            $timeout(function () {
                var CURRENT_URL = window.location.href.split('?')[0],
                        $BODY = $('body'),
                        $MENU_TOGGLE = $('#menu_toggle'),
                        $SIDEBAR_MENU = $('#sidebar-menu'),
                        $SIDEBAR_FOOTER = $('.sidebar-footer'),
                        $LEFT_COL = $('.left_col'),
                        $RIGHT_COL = $('.right_col'),
                        $NAV_MENU = $('.nav_menu'),
                        $FOOTER = $('footer');

                var setContentHeight = function () {
                    // reset height
                    $RIGHT_COL.css('min-height', $(window).height());

                    var bodyHeight = $BODY.outerHeight(),
                            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
                            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                    // normalize content
                    contentHeight -= $NAV_MENU.height() + footerHeight;

                    $RIGHT_COL.css('min-height', contentHeight);
                };

                $SIDEBAR_MENU.find('a').on('click', function (ev) {
                    var $li = $(this).parent();

                    if ($li.is('.active')) {
                        $li.removeClass('active active-sm');
                        $('ul:first', $li).slideUp(function () {
                            setContentHeight();
                        });
                    } else {
                        console.log("li is not active");

                        // prevent closing menu if we are on child menu
                        if (!$li.parent().is('.child_menu')) {
                            $SIDEBAR_MENU.find('li').filter(function () {
                                return !$(this).is($li);
                            }).removeClass('active active-sm');

                            $SIDEBAR_MENU.find('li ul').filter(function () {
                                return !$(this).parent().is($li);
                            }).slideUp();
                        }

                        $li.addClass('active');

                        $('ul:first', $li).slideDown(function () {
                            setContentHeight();
                        });
                    }
                });

                // toggle small or large menu
                $MENU_TOGGLE.on('click', function () {
                    if ($BODY.hasClass('nav-md')) {
                        $SIDEBAR_MENU.find('li.active ul').hide();
                        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                    } else {
                        $SIDEBAR_MENU.find('li.active-sm ul').show();
                        $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                    }

                    $BODY.toggleClass('nav-md nav-sm');

                    setContentHeight();
                });

                // check active menu
                $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

                $SIDEBAR_MENU.find('a').filter(function () {
                    return this.href == CURRENT_URL;
                }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
                    setContentHeight();
                }).parent().addClass('active');

                // recompute content when resizing

                $(window).smartresize(function () {
                    setContentHeight();
                });


                setContentHeight();

                // fixed sidebar
                if ($.fn.mCustomScrollbar) {
                    $('.menu_fixed').mCustomScrollbar({
                        autoHideScrollbar: true,
                        theme: 'minimal',
                        mouseWheel: {preventDefault: true}
                    });
                }

            }, 1000);

*/
        });

    }




})();
