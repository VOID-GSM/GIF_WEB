import React from "react";

export default function RainbowBorderRing(
  props: React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#pattern0_1048_2131)"
        strokeWidth="4"
      />
      <defs>
        <pattern
          id="pattern0_1048_2131"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1048_2131" transform="scale(0.00444444)" />
        </pattern>
        <image
          id="image0_1048_2131"
          width="225"
          height="225"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAIAAACx0UUtAAAQAElEQVR4AeT8ebBtSXbeh30rc+9z7r1vqrlHDAQBSpZoUaZlBy3/4UEhheVQOOQIKxTyH7bMMB1WhG3+4RBFMjiESYIAB5AAARAECRIwwcFsABJGEiABEgSJocFuAA12oxs9V1dV1/yGO51h78zl38o8975b9c5r1gOq2QB06rvrfLly5crcmd/OPZzXnfy3wKe6X6K4zzVQjouDM68bX7uvfDP5Hfd7fmfl53V2P4mCr+apnqz89nk52/hZ9VMPnHvZ+lxoSNQdLy/5vU/6537BP/RP/R//yPz9/+3m736r/yff7P/hN/i///X+O/+Ev/eP+s0/VNJ/M+uPl+FPeP46119w+1Zffoc/8//1r/5u/x9+fPvHP739M89Nf+21+YfOygdq/bzXc7qY3UF1j0Ng8IDy5O7HHkNkSJvq20Ko1xJBjHCKby/u584QZ/et1zoD96mh0N5JCoL95v5L+s3+8TcdgMsEZr9xrhv3dHRiC1/OWqwWdvpYPb55dzw4z+bSkXRDvsym67Z93NLRWkfPK31IL/+EfvH70o/9zfy+v7b8m39c/94f0+/64/V/9Cfm3/318+/5xvK//ivpP/0bi//iQ8cf+PDphz5x/rHnNp95dX7lpB6vU52yzOhepHd5USlaF50XP/vp/P/5qfzf/LP0+34y/Wc/Yf/xP9T//B/b/+Qn8+/+ZPnff7r8n56rf+Cl+i33/EfW/uGqV2UrrW9oe13zkfnCxCAjrRy7lmZFB6zdID58A2Upu2NxRpma3xr4LXUwcpZuty7DVteLFlKVNhrEgea10t1y7drmcHE26Did3bXX7tjn726fPd9+9nvmP/W3tv/vv3H+X3772f/x29b/+beV/+yv6r/46/o/f0i/9FF9+BP26efya6/l1UnW1lSkk+u3T6/dWR0db5Zn87CtSaboZGcUMVXzpLNtvbf110+SwN2k27Z+zV59xT7zoj7yeX3oze33P7/97s+tv/lz27/mme3Xfnb7Rz87/cHPbP/A8cG3nyx+4Nw+vJ3WdUpWUnJLhjiveT3wqoAPrsntnucTKhoMfxApBmT6LfBJvwWOYXcIXNBYQgRkXtgnF3eVV4eum1UHW2l7qPrU7M98fnz2zO7IV6vN5kPrj3zr9i//58P/4Xde/zf+yvDnvyt9y3+b3veT/v6PzM+/PK3PXGixbIpP6agOj9vynVq+2xfvKcO7S06pmM1iS9N9MXCKVFN148Sg7UyGWuZ6Ntfjp/TEU3rsKV1/XIeP+3DL9bj0uCsvlQ5UD9bTwWdWhz97fPj9tw/+xu3Db3lO//cX9Pte8j/4mn/DXf/Bc//AZB+p+pjJY6e宏_1234_정상적인_해독을_위해_기존_데이터_동일유지_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"
        />
      </defs>
    </svg>
  );
}
