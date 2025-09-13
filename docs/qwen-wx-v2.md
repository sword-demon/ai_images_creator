# HTTP 调用

图像模型处理时间较长，为了避免请求超时，HTTP 调用仅支持异步获取模型结果。您需要发起两个请求：

创建任务获取任务 ID：首先发起创建任务请求，该请求会返回任务 ID（task_id）。

根据任务 ID 查询结果：使用上一步获得的任务 ID，查询任务状态及结果。任务成功执行时将返回图像 URL，有效期 24 小时。

说明
创建任务后，该任务将被加入到排队队列，等待调度执行。后续需要调用“根据任务 ID 查询结果接口”获取任务状态及结果。

步骤 1：创建任务获取任务 ID
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis

请求参数
文生图文生图（使用反向提示词）
根据 prompt 生成图像。

```shell
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis \
 -H 'X-DashScope-Async: enable' \
 -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
 -H 'Content-Type: application/json' \
 -d '{
"model": "wan2.2-t2i-flash",
"input": {
"prompt": "一间有着精致窗户的花店，漂亮的木质门，摆放着花朵"
},
"parameters": {
"size": "1024\*1024",
"n": 1
}
}'
```

请求头（Headers）
Content-Type string （必选）

请求内容类型。此参数必须设置为 application/json。

Authorization string（必选）

请求身份认证。接口使用阿里云百炼 API-Key 进行身份认证。示例值：Bearer sk-xxxx。

X-DashScope-Async string （必选）

异步处理配置参数。HTTP 请求只支持异步，必须设置为 enable。

请求体（Request Body）
model string （必选）

模型名称。示例值：wan2.2-t2i-flash。

input object （必选）

输入的基本信息，如提示词等。

属性

prompt string （必选）

正向提示词，用来描述生成图像中期望包含的元素和视觉特点。

支持中英文，长度不超过 800 个字符，每个汉字/字母占一个字符，超过部分会自动截断。

示例值：一只坐着的橘黄色的猫，表情愉悦，活泼可爱，逼真准确。

提示词的使用技巧请参见文生图 Prompt 指南。

negative_prompt string （可选）

反向提示词，用来描述不希望在画面中看到的内容，可以对画面进行限制。

支持中英文，长度不超过 500 个字符，超过部分会自动截断。

示例值：低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良等。

parameters object （可选）

图像处理参数。

属性

size string （可选）

输出图像的分辨率。默认值是 1024\*1024。

图像宽高边长的像素范围为：[512, 1440]，单位像素。可任意组合以设置不同的图像分辨率，最高可达 200 万像素。

n integer （可选）

生成图片的数量。取值范围为 1~4 张，默认为 4。

seed integer （可选）

随机数种子，用于控制模型生成内容的随机性。seed 参数取值范围是[0, 2147483647]。

如果不提供，则算法自动生成一个随机数作为种子。如果给定了，则根据 n 的值分别为 n 张图片生成 seed 参数，例如 n=4，算法将分别生成 seed、seed+1、seed+2、seed+3 作为参数的图片。

如果您希望生成内容保持相对稳定，请使用相同的 seed 参数值。

prompt_extend bool （可选）

是否开启 prompt 智能改写。开启后会使用大模型对输入 prompt 进行智能改写，仅对正向提示词有效。对于较短的输入 prompt 生成效果提升明显，但会增加 3-4 秒耗时。

true：默认值，开启智能改写。

false：不开启智能改写。

watermark bool （可选）

是否添加水印标识，水印位于图片右下角，文案为“AI 生成”。

false：默认值，不添加水印。

true：添加水印。

响应参数
成功响应异常响应
任务已提交，状态为 PENDING（等待执行）。接下来，使用 task_id 调用查询接口获取最终结果。

此状态为提交任务后的正常中间状态，请勿重复提交。

```json
{
  "output": {
    "task_status": "PENDING",
    "task_id": "0385dc79-5ff8-4d82-bcb6-xxxxxx"
  },
  "request_id": "4909100c-7b5a-9f92-bfe5-xxxxxx"
}
```

output object

任务输出信息。

属性

task_id string

任务 ID。

task_status string

任务状态。

枚举值

PENDING：任务排队中

RUNNING：任务处理中

SUCCEEDED：任务执行成功

FAILED：任务执行失败

CANCELED：任务取消成功

UNKNOWN：任务不存在或状态未知

request_id string

请求唯一标识。可用于请求明细溯源和问题排查。

code string

请求失败的错误码。请求成功时不会返回此参数，详情请参见错误信息。

message string

请求失败的详细信息。请求成功时不会返回此参数，详情请参见错误信息。

步骤 2：根据任务 ID 查询结果
GET https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}

请求参数
查询任务结果
您需要将 86ecf553-d340-4e21-xxxxxxxxx 替换为真实的 task_id。

curl -X GET https://dashscope.aliyuncs.com/api/v1/tasks/86ecf553-d340-4e21-xxxxxxxxx \
--header "Authorization: Bearer $DASHSCOPE_API_KEY"
请求头（Headers）
Authorization string（必选）

请求身份认证。接口使用阿里云百炼 API-Key 进行身份认证。示例值：Bearer sk-xxxx。

URL 路径参数（Path parameters）
task_id string（必选）

任务 ID。

响应参数
任务执行成功任务执行失败任务部分失败
任务数据（如任务状态、图像 URL 等）仅保留 24 小时，超时后会被自动清除。请您务必及时保存生成的图像。

```json
{
  "request_id": "f767d108-7d50-908b-a6d9-xxxxxx",
  "output": {
    "task_id": "d492bffd-10b5-4169-b639-xxxxxx",
    "task_status": "SUCCEEDED",
    "submit_time": "2025-01-08 16:03:59.840",
    "scheduled_time": "2025-01-08 16:03:59.863",
    "end_time": "2025-01-08 16:04:10.660",
    "results": [
      {
        "orig_prompt": "一间有着精致窗户的花店，漂亮的木质门，摆放着花朵",
        "actual_prompt": "一间有着精致雕花窗户的花店，漂亮的深色木质门上挂着铜制把手。店内摆放着各式各样的鲜花，包括玫瑰、百合和向日葵，色彩鲜艳，生机勃勃。背景是温馨的室内场景，透过窗户可以看到街道。高清写实摄影，中景构图。",
        "url": "https://dashscope-result-wlcb.oss-cn-wulanchabu.aliyuncs.com/1.png"
      }
    ],
    "task_metrics": {
      "TOTAL": 1,
      "SUCCEEDED": 1,
      "FAILED": 0
    }
  },
  "usage": {
    "image_count": 1
  }
}
```

output object

任务输出信息。

属性

task_id string

任务 ID。

task_status string

任务状态。

枚举值

PENDING：任务排队中

RUNNING：任务处理中

SUCCEEDED：任务执行成功

FAILED：任务执行失败

CANCELED：任务取消成功

UNKNOWN：任务不存在或状态未知

submit_time string

任务提交时间。格式为 YYYY-MM-DD HH:mm:ss.SSS。

scheduled_time string

任务执行时间。格式为 YYYY-MM-DD HH:mm:ss.SSS。

end_time string

任务完成时间。格式为 YYYY-MM-DD HH:mm:ss.SSS。

results array object

任务结果列表，包括图像 URL、prompt、部分任务执行失败报错信息等。

数据结构

属性

orig_prompt string

原始的输入 prompt。

actual_prompt string

开启 prompt 智能改写后实际使用的 prompt。当不开启 prompt 智能改写时，该字段不会返回。

url string

模型生成图片的 URL 地址。

code string

图像错误码。部分任务执行失败时会返回该字段。

message string

图像错误信息。部分任务执行失败时会返回该字段。

task_metrics object

任务结果统计。

属性

TOTAL integer

总的任务数。

SUCCEEDED integer

任务状态为成功的任务数。

FAILED integer

任务状态为失败的任务数。

code string

请求失败的错误码。请求成功时不会返回此参数，详情请参见错误信息。

message string

请求失败的详细信息。请求成功时不会返回此参数，详情请参见错误信息。

usage object

输出信息统计。只对成功的结果计数。

属性

image_count integer

模型生成图片的数量。

request_id string

请求唯一标识。可用于请求明细溯源和问题排查。
