# Publishing and sharing

## Item visibility

For every item you create, you can set the visibility in the **Setup Info** section of the editor. Items can be:

- **Public**: anyone with the link can see them and they can be embedded in other sites;
- **Private**: visible only in your Private Area; the public link shows a notice and the sharing buttons are not available.

## How to share a public link

In the **Share** column of the list you find the direct link to the display page: `/display/charts/...` for charts and `/display/dashboards/...` for dashboards.

## How to embed an item in another site (embed)

The button with the code icon generates an **iframe** ready to paste into your site:

```html
<iframe width="600" height="400" src="https://.../embed/charts/ID" frameborder="0" allowfullscreen></iframe>
```

- The embed is minimal: only the visualisation, with no header or footer;
- the theme follows the visitor's preferences (light/dark); you can force it with `?theme=light` or `?theme=dark` at the end of the URL;
- adjust `width` and `height` to the needs of your page.

## Data refresh

Public charts linked to a remote URL refresh on their own at the first view after 24 hours from the last update: the server downloads the source again and applies the saved transformations.
