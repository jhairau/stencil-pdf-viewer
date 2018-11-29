# jh-pdf-viewer



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                | Type                           |
| ---------- | ---------- | ------------------------------------------ | ------------------------------ |
| `rotation` | `rotation` | Rotate the PDF in degrees {number}         | `0 \| 180 \| 270 \| 360 \| 90` |
| `src`      | `src`      | Src of the PDF to load and render {number} | `string`                       |


## Events

| Event          | Detail | Description |
| -------------- | ------ | ----------- |
| `onError`      | any    |             |
| `pageChange`   | number |             |
| `pageRendered` | number |             |


## Methods

### `pageNext(e: MouseEvent) => void`

Page forward
{MouseEvent} e

#### Parameters

| Name | Type         | Description |
| ---- | ------------ | ----------- |
| `e`  | `MouseEvent` |             |

#### Returns

Type: `void`



### `pagePrev(e: MouseEvent) => void`

Page backward
e

#### Parameters

| Name | Type         | Description |
| ---- | ------------ | ----------- |
| `e`  | `MouseEvent` |             |

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
