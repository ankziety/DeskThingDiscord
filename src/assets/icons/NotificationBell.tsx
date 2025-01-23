import { Icon, findClosestGlyphAvailable } from "./icons";

function IconNotificationBellOn(props: any): JSX.Element {
  const strokeWidth = props.strokeWidth || 1;

  const iconList = [
    {
      size: 24,
      svgContent: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_15_159)">
            <path d="M9.5 19C8.89555 19 7.01237 19 5.61714 19C4.87375 19 4.39116 18.2177 4.72361 17.5528L5.57771 15.8446C5.85542 15.2892 6 14.6774 6 14.0564C6 13.2867 6 12.1434 6 11C6 9 7 5 12 5C17 5 18 9 18 11C18 12.1434 18 13.2867 18 14.0564C18 14.6774 18.1446 15.2892 18.4223 15.8446L19.2764 17.5528C19.6088 18.2177 19.1253 19 18.382 19H14.5M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19" stroke="#000000" fill="grey" stroke-linejoin="round"/>
            <path d="M12 5V3" stroke="#000000" fill="grey" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      `,
    },
  ];

  const closestSize = findClosestGlyphAvailable(iconList, props.iconSize || 24);

  const svgContent = `
    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${closestSize.svgContent}</svg>
  `;

  return <Icon {...props} dangerouslySetInnerHTML={{ __html: svgContent }} />;
}

export default IconNotificationBellOn;
