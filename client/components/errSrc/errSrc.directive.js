'use strict';

angular.module('arbokApp')
    .directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src !== attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                        attrs.$set('class', 'missingImage');
                    }
                });
            }
        };
    });
