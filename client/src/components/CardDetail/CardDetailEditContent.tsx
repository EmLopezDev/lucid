import type { UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import Form from "../Form/Form";
import Input from "../Input/Input";
import Select from "../Select/Select";

type CardDetailEditContent = {
    data: UserLibraryDataType;
};

const CardDetailEditContent = ({ data }: CardDetailEditContent) => {
    return (
        <>
            <span className="card-detail__content__title">{data.title}</span>
            <span className="card-detail__content__genre">{data.genre}</span>
            <Form
                buttonSize="small"
                onSubmit={() => {}}
            >
                <div style={{ width: "100%", display: "flex" }}>
                    {" "}
                    <Select
                        id="1"
                        options={[{ value: "", label: "" }]}
                        value=""
                        onChange={() => {}}
                        selectSize="small"
                    />
                    <Select
                        id="2"
                        options={[{ value: "", label: "" }]}
                        value=""
                        onChange={() => {}}
                        selectSize="small"
                    />
                </div>
                <Input
                    label="Price"
                    type="number"
                    onChange={() => {}}
                    inputSize="small"
                    hasErrorText={false}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                />
                <Input
                    label="Purchase Date"
                    type="date"
                    onChange={() => {}}
                    inputSize="small"
                    hasErrorText={false}
                />
                <Input
                    label="Hours"
                    type="number"
                    onChange={() => {}}
                    inputSize="small"
                    hasErrorText={false}
                />
                <Input
                    label="Rating"
                    type="number"
                    onChange={() => {}}
                    inputSize="small"
                    hasErrorText={false}
                    min="0"
                    max="5"
                    step="0.25"
                    placeholder="0-5"
                />
                <label htmlFor="">
                    Comment
                    <textarea
                        name=""
                        id=""
                    ></textarea>
                </label>
            </Form>
        </>
    );
};

export default CardDetailEditContent;
