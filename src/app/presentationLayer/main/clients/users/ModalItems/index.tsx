import React, { useEffect, useReducer, useState } from "react";
import { Form, Input, Modal, Select } from "antd";
import { FormField } from "app/presentationLayer/components/form-field";
import { notFilledMessage } from "app/presentationLayer/main/clients/promotions/constants";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useStore } from "effector-react";
import effector from "app/presentationLayer/effects/clients/users";

type fieldsType = {
  firstName: string | null;
  lastName: string | null;
  patronymic: string | null;
  phoneNumber: string | null;
  branch: string | null;
  position: string | null;
};

const initialState: fieldsType = {
  firstName: null,
  lastName: null,
  patronymic: null,
  phoneNumber: null,
  branch: null,
  position: null,
};

function reducer(state, action): fieldsType {
  switch (action.type) {
    case "SET_BRANCH":
      return { ...state, branch: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    case "SET_FIRST_NAME":
      return { ...state, firstName: action.payload };
    case "SET_LAST_NAME":
      return { ...state, lastName: action.payload };
    case "SET_PATRONYMIC":
      return { ...state, patronymic: action.payload };
    case "SET_PHONE_NUMBER":
      return { ...state, phoneNumber: action.payload };
    case "SET_INITIAL_VALUE":
      return { ...action.payload };
    default:
      return { ...state };
  }
}

const ModalItems = (props) => {
  const {
    visibleModalAdd,
    setVisibleModalAdd,
    companyId,
    authoritiesList,
  } = props;
  const $branchItems = useStore(effector.stores.$branchesList);
  const { data: branchesData } = $branchItems;

  const [brachList, setBrachList] = useState<any>([]);

  const [customItemFields, dispatch] = useReducer(reducer, initialState);
  const [customItemErrors, setCustomItemErrors] = useState<fieldsType>(
    initialState
  );

  useEffect(() => {
    effector.effects.fetchBranchesListEffect({ companyId });
  }, []);
  useEffect(() => {
    try {
      if (!!branchesData && !branchesData?.content) setBrachList(branchesData);
    } catch (error) {
      console.log(error);
    }
  }, [branchesData]);

  useEffect(() => {
    !visibleModalAdd &&
      dispatch({ type: "SET_INITIAL_VALUE", payload: initialState });
  }, [visibleModalAdd]);

  const customItemValidation = (fields: fieldsType) => {
    let res = false;
    const obj = { ...fields };
    for (const key in obj) {
      if (obj[key] === null && key !== "patronymic") {
        obj[key] = notFilledMessage;
        if (!res) res = true;
      } else {
        obj[key] = null;
      }
    }
    setCustomItemErrors(obj);
    return res || !isValidPhoneNumber(customItemFields.phoneNumber || "");
  };
  const onSubmit = () => {
    const error = customItemValidation(customItemFields);
    if (error) return;
    const data: any = {
      authorities: customItemFields.position,
      branchId: customItemFields.branch,
      companyId,
      fullName: {
        firstName: customItemFields.firstName,
        lastName: customItemFields.lastName,
        patronymic: customItemFields.patronymic,
      },
      login: customItemFields.phoneNumber?.slice(1),
    };
    if (props.location?.state?.agreementId)
      data.agreementId = props.location.state.agreementId;
    effector.effects.createCompanyUser(data);
    setVisibleModalAdd(false);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={setVisibleModalAdd}
      autoComplete="off"
    >
      <Modal
        title="Новый сотрудник"
        centered={true}
        okType="primary"
        okText="Добавить"
        okButtonProps={{ htmlType: "submit" }}
        visible={visibleModalAdd}
        onOk={onSubmit}
        onCancel={() => setVisibleModalAdd(false)}
      >
        <>
          <Form.Item style={{ paddingBottom: 0, marginBottom: 0 }}>
            <Form.Item
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <FormField error={customItemErrors.branch}>
                <Select
                  placeholder="Филиал"
                  onChange={(val) =>
                    dispatch({ type: "SET_BRANCH", payload: val })
                  }
                >
                  {(brachList || []).map(({ name, id }) => (
                    <Select.Option value={id} key={id}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </FormField>
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: " 0 8px",
              }}
            >
              <FormField error={customItemErrors.position}>
                <Select
                  placeholder="Должность"
                  mode="multiple"
                  onChange={(val) =>
                    dispatch({ type: "SET_POSITION", payload: val })
                  }
                >
                  {authoritiesList.map((item) => {
                    return (
                      <Select.Option value={item.roleCode}>
                        {item.nameRu}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormField>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <FormField error={customItemErrors.lastName}>
              <Input
                placeholder="Фамилия"
                onChange={(val) =>
                  dispatch({ type: "SET_LAST_NAME", payload: val.target.value })
                }
              />
            </FormField>
          </Form.Item>
          <Form.Item>
            <FormField error={customItemErrors.firstName}>
              <Input
                placeholder="Имя"
                onChange={(val) =>
                  dispatch({
                    type: "SET_FIRST_NAME",
                    payload: val.target.value,
                  })
                }
              />
            </FormField>
          </Form.Item>
          <Form.Item>
            <FormField error={customItemErrors.patronymic}>
              <Input
                placeholder="Отчество"
                onChange={(val) =>
                  dispatch({
                    type: "SET_PATRONYMIC",
                    payload: val.target.value,
                  })
                }
              />
            </FormField>
          </Form.Item>
          <FormField
            error={
              !!customItemFields.phoneNumber
                ? isValidPhoneNumber(customItemFields.phoneNumber || "") ||
                  customItemErrors.phoneNumber
                  ? null
                  : "Проверьте правильность номера"
                : customItemErrors.phoneNumber
            }
          >
            <PhoneInput
              defaultCountry="UZ"
              countryCallingCodeEditable={false}
              international
              countries={["UZ"]}
              placeholder="Телефон"
              value={customItemFields.phoneNumber || ""}
              onChange={(val) =>
                dispatch({ type: "SET_PHONE_NUMBER", payload: val })
              }
            />
          </FormField>
        </>
      </Modal>
    </Form>
  );
};

export default React.memo((props: any) => {
  if (props.visibleModalAdd) return <ModalItems {...props} />;
  return null;
});
