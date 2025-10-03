// react-dialog.d.ts
declare module "react-dialog" {
  import * as React from "react";

  interface DialogProps extends React.PropsWithChildren<{}> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }

  interface DialogTriggerProps extends React.PropsWithChildren<{}> {
    asChild?: boolean;
  }

  interface DialogContentProps extends React.PropsWithChildren<{}> {}

  export class Dialog extends React.Component<DialogProps> {}
  export class DialogTrigger extends React.Component<DialogTriggerProps> {}
  export class DialogContent extends React.Component<DialogContentProps> {}
}
