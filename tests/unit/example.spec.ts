import { shallowMount } from "@vue/test-utils";
import ExampleComponent from "@/components/ExampleComponent.vue";

describe("ExampleComponent.vue", () => {
  it("renders props.msg when passed", () => {
    const wrapper = shallowMount(ExampleComponent);
    expect(wrapper.find("span").text()).toMatch("This is example component");
  });
});
