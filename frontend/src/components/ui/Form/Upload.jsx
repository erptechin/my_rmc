// Import Dependencies
import PropTypes from "prop-types";
import { useRef, forwardRef } from "react";

// Local Imports
import { useMergedRef } from "hooks";
import { uploadFile } from "utils/apis";

// ----------------------------------------------------------------------

const Upload = forwardRef((props, ref) => {
  const {
    onChange = () => { },
    children,
    multiple,
    accept,
    name,
    form,
    disabled,
    capture,
    inputProps,
    ...rest
  } = props;
  const inputRef = useRef();

  const onClick = () => {
    !disabled && inputRef.current.click();
  };

  const handleChange = async (event) => {
    if (multiple) {
      onChange(Array.from(event.currentTarget.files));
    } else {
      const response = await uploadFile(event.currentTarget.files[0]);
      if (response?.file_url) {
        onChange(response?.file_url);
      }
    }
  };

  return (
    <>
      {children({ onClick, disabled, ...rest })}

      <input
        hidden
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        ref={useMergedRef(ref, inputRef)}
        name={name}
        form={form}
        capture={capture}
        {...inputProps}
      />
    </>
  );
});

Upload.displayName = "Upload";

Upload.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  capture: PropTypes.string,
  name: PropTypes.string,
  form: PropTypes.string,
  inputProps: PropTypes.object,
};

export { Upload };
