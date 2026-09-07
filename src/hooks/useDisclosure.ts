import { useState } from "react";

type DisclosureType = {
  isOpen: boolean;
  id: string | null;
};

const useDisclosure = () => {
  const [state, setState] = useState<DisclosureType>({
    isOpen: false,
    id: null,
  });

  const onOpen = (id?: string) => {
    setState({ isOpen: true, id: id || null });
  };

  const onClose = () => {
    setState({ isOpen: false, id: null });
  };

  return {
    isOpen: state.isOpen,
    id: state.id,
    onOpen,
    onClose,
  };
};

export default useDisclosure;
