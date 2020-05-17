(function() {
    'use strict';

    angular.module('NarrowListmenuApp', [])
        .controller('NarrowtheListController', NarrowtheListController)
        .service('MenuListService', MenuListService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItems);
		//This is my ddo for the directive
    function FoundItems() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'jcbdirectivetemplate.html',
            scope: {
                foundItems: '<',
                onEmpty: '<',
                onRemove: '&'
            },
            controller: NarrowtheListController,
            controllerAs: 'menu',
            bindToController: true
        };

        return ddo;
    }
		//Here I declare the controler and its function
    NarrowtheListController.$inject = ['MenuListService'];

    function NarrowtheListController(MenuListService) {
        var menu = this;
        menu.shortName = '';

        menu.matchedMenuItems = function(searchTerm) {
            var promise = MenuListService.getMatchedMenuItems(searchTerm);
			//Just to have a asyncronous behaviour
            promise.then(function(items) {
                if (items && items.length > 0) {
                    menu.message = '';
                    menu.found = items;
                } else {
                    menu.message = 'Nothing found!';
                    menu.found = [];
                }
            });
        };
			//Action remove
        menu.removeMenuItem = function(itemIndex) {
            menu.found.splice(itemIndex, 1);
        }
    }
		//My service
    MenuListService.$inject = ['$http', 'ApiBasePath'];

    function MenuListService($http, ApiBasePath) {
        var localservice = this;
		//call external url
        localservice.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function(response) {
                var foundItems = [];
				//assure content no 0 and lower case and push the data
                for (var i = 0; i < response.data['menu_items'].length; i++) {
                    if (searchTerm.length > 0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(response.data['menu_items'][i]);
                    }
                }

                return foundItems;
            });
        };
    }
})();
