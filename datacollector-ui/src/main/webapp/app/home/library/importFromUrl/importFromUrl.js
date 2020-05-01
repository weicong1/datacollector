/*
 * Copyright 2018 StreamSets Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Controller for Import from HTTP URL Modal Dialog.
angular
  .module('dataCollectorApp.home')
  .controller('ImportFromURLModalInstanceController', function (
    $scope, $modalInstance, api, pipelineTitle, pipelineHttpUrl, tracking
  ) {

    angular.extend($scope, {
      common: {
        errors: []
      },
      showLoading: true,
      newConfig : {
        title: pipelineTitle || '',
        description: '',
        pipelineHttpUrl: pipelineHttpUrl || ''
      },
      operationDone: false,
      operationInProgress: false,

      import: function () {
        $scope.operationInProgress = true;
        tracking.mixpanel.track('Import Pipeline From URL Started', {});
        api.pipelineAgent.importPipelineFromUrl($scope.newConfig.title, $scope.newConfig.pipelineHttpUrl)
          .then(function(response) {
            $scope.operationDone = true;
            $scope.operationInProgress = false;
            tracking.mixpanel.track('Import Pipeline From URL Completed', {});
            tracking.mixpanel.people.set({'Core Journey Stage - Pipeline Imported': true});
            $modalInstance.close(response.data);
          })
          .catch(function(res) {
            $scope.common.errors = [res.data];
            $scope.operationDone = true;
            $scope.operationInProgress = false;
            tracking.mixpanel.track('Import Pipeline From URL', {'Failure Reason': JSON.stringify(res.data)});

          });
      },

      cancel: function () {
        $modalInstance.dismiss('cancel');
      }
    });

  });
