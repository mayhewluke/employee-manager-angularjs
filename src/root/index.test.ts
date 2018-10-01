jest.mock("./root.css", () => null); // Prevent jest from trying to read this import

import { default as uiRouterModule, UrlService } from "@uirouter/angularjs";
import angular from "angular";
import "angular-mocks";

import { rootModule } from ".";

describe("root module", () => {
  let urlService: UrlService;
  beforeEach(() => {
    // Create an angular module in order to get access to providers and stub
    // them before they can be used
    angular
      .module("rootModuleTest", [uiRouterModule])
      .config(($urlServiceProvider: UrlService) => {
        urlService = $urlServiceProvider;
        jest.spyOn(urlService.rules, "otherwise");
      });
    // Call test modules BEFORE actual modules
    angular.mock.module("rootModuleTest", rootModule);
    // Required for the config block to be run
    inject();
  });

  // TODO would probably be better to test by navigating to an invalid URL, and
  // then check the URL doesn't change and the 404 component gets rendered
  it("sets up a redirectless 404 page", () => {
    const config = {
      options: { location: false },
      state: "404",
    };
    expect(urlService.rules.otherwise).toHaveBeenCalledTimes(1);
    expect(urlService.rules.otherwise).toHaveBeenCalledWith(config);
  });
});
