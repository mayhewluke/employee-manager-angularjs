import angular, { ICompileService, IScope } from "angular";
import "angular-mocks";

import err404Component from "./err404.component";

describe("err404 component", () => {
  let render: () => JQLite;
  let scope: IScope;
  beforeEach(angular.mock.module(err404Component));
  beforeEach(
    angular.mock.inject(($rootScope: IScope, $compile: ICompileService) => {
      scope = $rootScope.$new();
      render = () => $compile("<err404></err404>")(scope);
    }),
  );

  it("displays an error message", () => {
    const element = render();

    expect(element.find(".error")[0].outerHTML).toMatchSnapshot();
  });

  it("provides a link back to the app", () => {
    const element = render();

    expect(element.find("a[ui-sref]").attr("ui-sref")).toEqual("init");
  });
});
