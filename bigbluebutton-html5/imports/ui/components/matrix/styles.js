import styled from 'styled-components';
import {
  mdPaddingX,
  mdPaddingY,
  smPaddingX,
  lgPaddingY,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  colorWhite,
  colorGray,
  colorGrayLightest,
} from '/imports/ui/stylesheets/styled-components/palette';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { fontSizeSmall } from '/imports/ui/stylesheets/styled-components/typography';

const Matrix = styled.div`
  background-color: ${colorWhite};
  padding: ${mdPaddingX} ${mdPaddingY} ${mdPaddingX} ${mdPaddingX};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  ${({ isChrome }) => isChrome && `
    transform: translateZ(0);
  `}

  @media ${smallOnly} {
    transform: none !important;
  }
`;

const Hint = styled.span`
  visibility: hidden;
  position: absolute;
  @media (pointer: none) {
    visibility: visible;
    position: relative;
    color: ${colorGray};
    font-size: ${fontSizeSmall};
    font-style: italic;
    padding: ${smPaddingX} 0 0 ${smPaddingX};
    text-align: left;
    [dir="rtl"] & {
      padding-right: ${lgPaddingY} ${lgPaddingY} 0 0;
      text-align: right;
    }
  }
`;

const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-style: none;
  border-bottom: 1px solid ${colorGrayLightest};
  padding-bottom: 5px;
`;

export default {
  Matrix,
  Hint,
  IFrame,
};
