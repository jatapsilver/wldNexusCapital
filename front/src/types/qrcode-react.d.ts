declare module "qrcode.react" {
  import * as React from "react";

  export interface QRCodeProps {
    value: string;
    size?: number;
    level?: "L" | "M" | "Q" | "H";
    bgColor?: string;
    fgColor?: string;
    includeMargin?: boolean;
    renderAs?: "canvas" | "svg";
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
  }

  export const QRCode: React.FC<QRCodeProps>;
}
