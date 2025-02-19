import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmptyPath = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);
  return <div></div>;
};

export default EmptyPath;
