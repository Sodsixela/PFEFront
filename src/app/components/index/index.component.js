"use strict";

let index_controller = function indexController($http, $state, GlobalConfigFactory, $element, $window, moment) {
  let self = this;
  self.url = GlobalConfigFactory.url_back;
  self.user     = JSON.parse($window.localStorage.getItem("user")) // Data about connected user

  // Check user authentication
  $http.get(self.url + 'users/authrequired').then((response) => {
    if (!JSON.parse(response.data)) {
      $window.location.href = '/#!/login';
    }

    self.loader = true
    let url = "all/data"
    url = self.user.jobID.name === "Manager" ? "team/" + self.user.teamID.name : url
    url = self.user.jobID.name === "Member" ? self.user._id : url
    $http.get(self.url + 'users/' + url).then((response) => {
      self.loader = false
      self.users = response.data
      console.log("Users : ", self.users)
    })
  })

  self.clickIndex = function() {
    $window.location.href = '/#!/index';
  }

  // Click on logout button
  self.logout = function() {
    $http.get(self.url + 'users/logout').then((response) => {
      if (JSON.parse(response.data)) {
        $window.location.href = '/#!/login';
      }
    })
  }
  
  // Click on a user
  self.clickUser = function(user) {
    if (self.userSelected !== user) {
      self.userSelected = user
      self.loader_b = true

      $http.get(self.url + 'data/user/' + user._id).then((response) => {
        self.loader_b = false
        self.data = response.data
        // Convert date format
        for (let key in self.data) {
          self.data[key].date = moment(self.data[key].date, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'").format('DD/MM/YYYY à HH:mm:ss')
        }
      })

      $http.get(self.url + 'jackets/user/' + user._id).then((response) => {
        self.userSelected.jacket = response.data
      })
    }
  }

  // Test du set de data
  // $http({
  //   method: 'POST',
  //   url: self.url + 'data/set',
  //   data: {
  //     "id":"0123456789",
  //     "global":[{
  //       "date":"2019-01-13 12:24:51.000",
  //       "data":[{
  //         "code": "0",
  //         "sensors":[{
  //           "x":"0",
  //           "y":"0",
  //           "z":"0"
  //         }, {
  //           "x":"1",
  //           "y":"1",
  //           "z":"1"
  //         }, {
  //           "x":"2",
  //           "y":"2",
  //           "z":"2"
  //         }]
  //       }]
  //     }]
  //   },
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).then((response) => {
  //   console.log(response)
  // })
};

index_controller.$inject = ['$http', '$state', 'GlobalConfigFactory', '$element', '$window', 'moment'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};

module.exports = index;