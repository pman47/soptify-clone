"use client";
import { FC } from "react";
import Modal from "./Modal";

interface AuthModalProps {}

const AuthModal: FC<AuthModalProps> = ({}) => {
  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen
      onChange={() => {}}
    >
      Auth Modal children!
    </Modal>
  );
};

export default AuthModal;
