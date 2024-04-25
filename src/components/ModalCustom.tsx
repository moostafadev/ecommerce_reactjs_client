import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  clickHandler: () => void;
  isLoading?: boolean;
  title: string;
  okBtn?: string;
  cancelBtn?: string;
  children: ReactNode;
}

const ModalCustom = ({
  isOpen,
  onClose,
  clickHandler,
  isLoading,
  title,
  okBtn = "Done",
  cancelBtn = "cancel",
  children,
}: IProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            {cancelBtn}
          </Button>
          <Button
            colorScheme="blue"
            onClick={clickHandler}
            isLoading={isLoading}
          >
            {okBtn}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCustom;
