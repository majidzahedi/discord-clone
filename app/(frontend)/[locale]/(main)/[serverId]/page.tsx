import api from "@/lib/elsya"

const page = async () => {
  const result = await api.hello.get()

  return <div>{result.data}</div>
}

export default page
