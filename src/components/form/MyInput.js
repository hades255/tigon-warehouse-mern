import React, { useCallback, useState } from "react";
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

const MyInput = ({
  type = "text",
  icon = "",
  addonType = "prepend",
  clickIcon = null,
  ...props
}) => {
  const [focus, setFocus] = useState(false);

  const handleSetFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const handleReleaseFocus = useCallback(() => {
    setFocus(false);
  }, []);

  return (
    <FormGroup className="w-100 no-border">
      <InputGroup className={"no-border" + (focus ? " input-group-focus" : "")}>
        {icon && addonType === "prepend" && (
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className={`now-ui-icons ${icon}`}></i>
            </InputGroupText>
          </InputGroupAddon>
        )}
        <Input
          type={type}
          onFocus={handleSetFocus}
          onBlur={handleReleaseFocus}
          {...props}
        />
        {icon && addonType === "append" && (
          <InputGroupAddon addonType="append" className="cursor-pointer">
            <InputGroupText>
              <i className={`now-ui-icons ${icon}`}></i>
            </InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
    </FormGroup>
  );
};

export default MyInput;
