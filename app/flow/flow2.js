var app = angular.module("flowing", []);
app.controller("flowController", function($scope) {
    $scope.flow = [[{
      "text": "Racism is bad",
      "cards": [{
        "tag": "Yaomomoako",
        "content": "stuff like racism is bad"
      },
      {
        "tag": "Isaac Lo",
        "content": "memes are the only option"
      }]
    },
    {
      "text": "Bad is unjust",
      "cards": []
    },
    {
      "text": "Thus we negate",
      "cards": []
    }]];
});
