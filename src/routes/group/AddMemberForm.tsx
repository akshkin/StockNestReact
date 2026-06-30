import React, { useState } from "react";
import {
  useEditGroupMemberRoleMutation,
  useInviteMemeberToGroupMutation,
} from "../../api/groupsApi";
import { inviteMemberSchema } from "../../schemas";
import type z from "zod";
import InputField from "../../components/inputField/InputField";
import ErrorText from "../../components/errorText/ErrorText";
import styles from "./group.module.scss";
import {
  normalizeApiError,
  zodErrorsToObject,
  type MemberRole,
} from "../../helpers/utils";
import { toast } from "react-toastify";
import { Info } from "lucide-react";

type inviteMemberSchema = z.infer<typeof inviteMemberSchema>;

type AddMemberFormProps = {
  groupId: number;
  closeModal: () => void;
  isEditingRole?: boolean;
  memberRole?: MemberRole;
  userId?: string;
};

function AddMemberForm({
  groupId,
  closeModal,
  isEditingRole = false,
  memberRole,
  userId,
}: AddMemberFormProps) {
  const defaultInviterData: inviteMemberSchema = {
    email: "",
    role: memberRole ?? "Viewer",
  };
  const [formData, setFormData] = useState(defaultInviterData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof inviteMemberSchema, string>>
  >({});
  const [
    inviteMemberToGroup,
    { error: inviteError, isLoading: isInviting, reset },
  ] = useInviteMemeberToGroupMutation();
  const [editMemberRole, { isLoading: loadingIsEditingRole }] =
    useEditGroupMemberRoleMutation();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    reset();

    const newFormData = { ...formData, [e.target.name]: e.target.value };

    setFormData(newFormData);

    const result = inviteMemberSchema.safeParse(newFormData);

    if (!result.success) {
      const formErrors = zodErrorsToObject(result.error);
      setErrors(formErrors);
      return;
    } else {
      setErrors({});
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEditingRole) {
        await editMemberRole({
          groupId: Number(groupId),
          userId: userId,
          dto: { role: formData.role },
        }).unwrap();
      } else {
        await inviteMemberToGroup({
          groupId: Number(groupId),
          inviterData: { ...formData },
        }).unwrap();
      }
      if (isEditingRole) {
        toast.success("Successfully changed member's role");
      } else {
        toast.success("Successfully added member to group!");
      }
    } catch (err) {
      console.error("Failed to invite member to group", err);
      if (isEditingRole) {
        toast.error("Failed to change the member's role");
      } else {
        toast.error("Failed to invite member to group");
      }
    } finally {
      setFormData(defaultInviterData);
      closeModal();
    }
  }

  const isFormValid = isEditingRole
    ? formData.role !== memberRole // if new role is other than the current role
    : Object.keys(errors).length === 0 && formData.email && formData.role;

  return (
    <form>
      {!isEditingRole && (
        <InputField
          label="Email Address"
          value={formData.email}
          name="email"
          placeholder="johndoe@example.com"
          onChange={(e) => handleChange(e)}
          error={errors?.email}
        />
      )}

      <div className={styles.wrapper}>
        <label htmlFor="role">Select role </label>
        <Info className={styles.icon} />

        <div className={styles.tooltip}>
          <p>
            <strong>Co-Owner</strong> — Full access inclusing adding other
            members
          </p>
          <p>
            <strong>Member</strong> — Create and edit items, category
          </p>
          <p>
            <strong>Viewer</strong> — View only
          </p>
        </div>
      </div>

      <select
        name="role"
        value={formData.role}
        onChange={(e) => handleChange(e)}
      >
        <option value="Co-Owner">Co-Owner</option>
        <option value="Member">Member</option>
        <option value="Viewer">Viewer</option>
      </select>

      <div className={styles.buttonsContainer}>
        <button
          disabled={isInviting || !isFormValid || loadingIsEditingRole}
          onClick={handleSubmit}
        >
          {isEditingRole ? "Save" : "Add"}
        </button>
        <button className="invertedButton" type="button" onClick={closeModal}>
          Cancel
        </button>
      </div>
      {inviteError && (
        <ErrorText
          error={
            normalizeApiError(inviteError).message ??
            "An error occurred while inviting the member"
          }
        />
      )}
    </form>
  );
}

export default AddMemberForm;
