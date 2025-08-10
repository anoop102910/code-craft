import { Edit, useForm } from "@refinedev/antd";
import { ProblemForm } from "./form";

export const ProblemEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <ProblemForm formProps={formProps} />
    </Edit>
  );
};
