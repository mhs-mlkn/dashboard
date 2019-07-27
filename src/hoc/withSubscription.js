import React, { Component } from "react";
import { Subscribe } from "unstated";
import { values } from "lodash";

export default function withSubscription(containers, WrappedComponent) {
  return class ContainerAsProps extends Component {
    static displayName = `withSubscription(${getDisplayName(
      WrappedComponent
    )})`;

    render() {
      return (
        <Subscribe to={values(containers)}>
          {() => {
            // const res = {};
            // const props = keys(containers);
            // for (let i = 0; i < props.length; i++) {
            //   const prop = props[i];
            //   res[prop] = stores[i];
            // }
            return (
              <WrappedComponent {...containers} {...this.props}>
                {this.props.children}
              </WrappedComponent>
            );
          }}
        </Subscribe>
      );
    }
  };
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
