import { Create, useForm } from "@refinedev/antd";
import { ProblemForm } from "./form";

export const ProblemCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProblemForm formProps={formProps} />
    </Create>
  );
};
