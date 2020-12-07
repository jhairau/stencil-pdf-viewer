# jh-pdf-viewer



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                | Type                           | Default     |
| ---------- | ---------- | ------------------------------------------ | ------------------------------ | ----------- |
| `rotation` | `rotation` | Rotate the PDF in degrees {number}         | `0 \| 180 \| 270 \| 360 \| 90` | `0`         |
| `src`      | `src`      | Src of the PDF to load and render {number} | `string`                       | `undefined` |


## Events

| Event          | Description | Type                  |
| -------------- | ----------- | --------------------- |
| `pageChange`   |             | `CustomEvent<number>` |
| `pageRendered` |             | `CustomEvent<number>` |


## Methods

### `pageNext(e: MouseEvent) => Promise<void>`

Page forward
{MouseEvent} e

#### Returns

Type: `Promise<void>`



### `pagePrev(e: MouseEvent) => Promise<void>`

Page backward
e

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
