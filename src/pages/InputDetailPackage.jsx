import { useInputDetailPackage } from "../hooks/useInputDetailPackage";
import InputDetailPackageForm from "../components/forms/InputDetailPackageForm";

function InputDetailPackage() {
  const { formData, errors, handleChange, handleSave, handleCancel, handleFileChange } = useInputDetailPackage();

  return (
    <InputDetailPackageForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleFileChange={handleFileChange}
    />
  );
}

export default InputDetailPackage;