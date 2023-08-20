"use client";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";

const UploadModal = () => {
  const uploadModal = useUploadModal();

  const onChange = (open: boolean) => {
    if (!open) {
      //   Reset the form
      uploadModal.onClose();
    }
  };

  return (
    <Modal
      title="Upload Modal Title"
      description="Upload Modal Description"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      Upload Content
    </Modal>
  );
};

export default UploadModal;
