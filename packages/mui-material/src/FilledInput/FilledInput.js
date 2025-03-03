import * as React from 'react';
import { refType, deepmerge } from '@mui/utils';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import InputBase from '../InputBase';
import styled, { rootShouldForwardProp } from '../styles/styled';
import useThemeProps from '../styles/useThemeProps';
import filledInputClasses, { getFilledInputUtilityClass } from './filledInputClasses';
import {
  rootOverridesResolver as inputBaseRootOverridesResolver,
  inputOverridesResolver as inputBaseInputOverridesResolver,
  InputBaseRoot,
  InputBaseComponent as InputBaseInput,
} from '../InputBase/InputBase';

const useUtilityClasses = (ownerState) => {
  const { classes, disableUnderline } = ownerState;

  const slots = {
    root: ['root', !disableUnderline && 'underline'],
    input: ['input'],
  };

  const composedClasses = composeClasses(slots, getFilledInputUtilityClass, classes);

  return {
    ...classes, // forward classes to the InputBase
    ...composedClasses,
  };
};

const FilledInputRoot = styled(InputBaseRoot, {
  shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === 'classes',
  name: 'MuiFilledInput',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;
    return [
      ...inputBaseRootOverridesResolver(props, styles),
      !ownerState.disableUnderline && styles.underline,
    ];
  },
})(({ theme, ownerState }) => {
  const light = theme.palette.mode === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  const backgroundColor = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)';
  const hoverBackground = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)';
  const disabledBackground = light ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
  return {
    position: 'relative',
    backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    '&:hover': {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.hoverBg : hoverBackground,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
      },
    },
    [`&.${filledInputClasses.focused}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    },
    [`&.${filledInputClasses.disabled}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.disabledBg : disabledBackground,
    },
    ...(!ownerState.disableUnderline && {
      '&:after': {
        borderBottom: `2px solid ${
          (theme.vars || theme).palette[ownerState.color || 'primary']?.main
        }`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        position: 'absolute',
        right: 0,
        transform: 'scaleX(0)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut,
        }),
        pointerEvents: 'none', // Transparent to the hover style.
      },
      [`&.${filledInputClasses.focused}:after`]: {
        // translateX(0) is a workaround for Safari transform scale bug
        // See https://github.com/mui/material-ui/issues/31766
        transform: 'scaleX(1) translateX(0)',
      },
      [`&.${filledInputClasses.error}:after`]: {
        borderBottomColor: (theme.vars || theme).palette.error.main,
        transform: 'scaleX(1)', // error is always underlined in red
      },
      '&:before': {
        borderBottom: `1px solid ${
          theme.vars
            ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputTouchBottomLine})`
            : bottomLineColor
        }`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '"\\00a0"',
        position: 'absolute',
        right: 0,
        transition: theme.transitions.create('border-bottom-color', {
          duration: theme.transitions.duration.shorter,
        }),
        pointerEvents: 'none', // Transparent to the hover style.
      },
      [`&:hover:not(.${filledInputClasses.disabled}):before`]: {
        borderBottom: `1px solid ${(theme.vars || theme).palette.text.primary}`,
      },
      [`&.${filledInputClasses.disabled}:before`]: {
        borderBottomStyle: 'dotted',
      },
    }),
    ...(ownerState.startAdornment && {
      paddingLeft: 12,
    }),
    ...(ownerState.endAdornment && {
      paddingRight: 12,
    }),
    ...(ownerState.multiline && {
      padding: '25px 12px 8px',
      ...(ownerState.size === 'small' && {
        paddingTop: 21,
        paddingBottom: 4,
      }),
      ...(ownerState.hiddenLabel && {
        paddingTop: 16,
        paddingBottom: 17,
      }),
    }),
  };
});

const FilledInputInput = styled(InputBaseInput, {
  name: 'MuiFilledInput',
  slot: 'Input',
  overridesResolver: inputBaseInputOverridesResolver,
})(({ theme, ownerState }) => ({
  paddingTop: 25,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,
  ...(!theme.vars && {
    '&:-webkit-autofill': {
      WebkitBoxShadow: theme.palette.mode === 'light' ? null : '0 0 0 100px #266798 inset',
      WebkitTextFillColor: theme.palette.mode === 'light' ? null : '#fff',
      caretColor: theme.palette.mode === 'light' ? null : '#fff',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
    },
  }),
  ...(theme.vars && {
    '&:-webkit-autofill': {
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
    },
    [theme.getColorSchemeSelector('dark')]: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px #266798 inset',
        WebkitTextFillColor: '#fff',
        caretColor: '#fff',
      },
    },
  }),
  ...(ownerState.size === 'small' && {
    paddingTop: 21,
    paddingBottom: 4,
  }),
  ...(ownerState.hiddenLabel && {
    paddingTop: 16,
    paddingBottom: 17,
  }),
  ...(ownerState.multiline && {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }),
  ...(ownerState.startAdornment && {
    paddingLeft: 0,
  }),
  ...(ownerState.endAdornment && {
    paddingRight: 0,
  }),
  ...(ownerState.hiddenLabel &&
    ownerState.size === 'small' && {
      paddingTop: 8,
      paddingBottom: 9,
    }),
}));

const FilledInput = React.forwardRef(function FilledInput(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiFilledInput' });

  const {
    disableUnderline,
    components = {},
    componentsProps: componentsPropsProp,
    fullWidth = false,
    hiddenLabel, // declare here to prevent spreading to DOM
    inputComponent = 'input',
    multiline = false,
    type = 'text',
    ...other
  } = props;

  const ownerState = {
    ...props,
    fullWidth,
    inputComponent,
    multiline,
    type,
  };

  const classes = useUtilityClasses(props);
  const filledInputComponentsProps = { root: { ownerState }, input: { ownerState } };

  const componentsProps = componentsPropsProp
    ? deepmerge(componentsPropsProp, filledInputComponentsProps)
    : filledInputComponentsProps;

  return (
    <InputBase
      components={{ Root: FilledInputRoot, Input: FilledInputInput, ...components }}
      componentsProps={componentsProps}
      fullWidth={fullWidth}
      inputComponent={inputComponent}
      multiline={multiline}
      ref={ref}
      type={type}
      {...other}
      classes={classes}
    />
  );
});

FilledInput.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * This prop helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it [following the specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
   */
  autoComplete: PropTypes.string,
  /**
   * If `true`, the `input` element is focused during the first mount.
   */
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#adding-new-colors).
   * The prop defaults to the value (`'primary'`) inherited from the parent FormControl component.
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['primary', 'secondary']),
    PropTypes.string,
  ]),
  /**
   * The components used for each slot inside the InputBase.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components: PropTypes.shape({
    Input: PropTypes.elementType,
    Root: PropTypes.elementType,
  }),
  /**
   * The props used for each slot inside the Input.
   * @default {}
   */
  componentsProps: PropTypes.shape({
    input: PropTypes.object,
    root: PropTypes.object,
  }),
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true`, the component is disabled.
   * The prop defaults to the value (`false`) inherited from the parent FormControl component.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the input will not have an underline.
   */
  disableUnderline: PropTypes.bool,
  /**
   * End `InputAdornment` for this component.
   */
  endAdornment: PropTypes.node,
  /**
   * If `true`, the `input` will indicate an error.
   * The prop defaults to the value (`false`) inherited from the parent FormControl component.
   */
  error: PropTypes.bool,
  /**
   * If `true`, the `input` will take up the full width of its container.
   * @default false
   */
  fullWidth: PropTypes.bool,
  /**
   * If `true`, the label is hidden.
   * This is used to increase density for a `FilledInput`.
   * Be sure to add `aria-label` to the `input` element.
   * @default false
   */
  hiddenLabel: PropTypes.bool,
  /**
   * The id of the `input` element.
   */
  id: PropTypes.string,
  /**
   * The component used for the `input` element.
   * Either a string to use a HTML element or a component.
   * @default 'input'
   */
  inputComponent: PropTypes.elementType,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   * @default {}
   */
  inputProps: PropTypes.object,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: refType,
  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   * The prop defaults to the value (`'none'`) inherited from the parent FormControl component.
   */
  margin: PropTypes.oneOf(['dense', 'none']),
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  maxRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Minimum number of rows to display when multiline option is set to true.
   */
  minRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * If `true`, a [TextareaAutosize](/material-ui/react-textarea-autosize/) element is rendered.
   * @default false
   */
  multiline: PropTypes.bool,
  /**
   * Name attribute of the `input` element.
   */
  name: PropTypes.string,
  /**
   * Callback fired when the value is changed.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange: PropTypes.func,
  /**
   * The short hint displayed in the `input` before the user enters a value.
   */
  placeholder: PropTypes.string,
  /**
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   */
  readOnly: PropTypes.bool,
  /**
   * If `true`, the `input` element is required.
   * The prop defaults to the value (`false`) inherited from the parent FormControl component.
   */
  required: PropTypes.bool,
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Start `InputAdornment` for this component.
   */
  startAdornment: PropTypes.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
   * @default 'text'
   */
  type: PropTypes.string,
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value: PropTypes.any,
};

FilledInput.muiName = 'Input';

export default FilledInput;
