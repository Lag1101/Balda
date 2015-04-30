#include <nan.h>

#include "WordTree.h"

#include <iostream>
#include <codecvt>
#include <string>

using namespace v8;

WordTree wordTree;

std::wstring s2ws(const std::string& str)
{
	typedef std::codecvt_utf16<wchar_t> convert_typeX;
	std::wstring_convert<convert_typeX, wchar_t> converterX;

	return converterX.from_bytes(str);
}

std::string ws2s(const std::wstring& str)
{
	typedef std::codecvt_utf16<wchar_t> convert_typeX;
	std::wstring_convert<convert_typeX, wchar_t> converterX;

	return converterX.to_bytes(str);
}

NAN_METHOD(Clear) {
    NanScope();

    wordTree.clear();

    NanReturnUndefined();
}
NAN_METHOD(getEasyWordByLength) {
	NanScope();

	if (args.Length() < 1) {
		NanThrowTypeError("Wrong number of arguments");
		NanReturnUndefined();
	}
	if (!args[0]->IsUint32() ) {
		NanThrowTypeError("Wrong arguments");
		NanReturnUndefined();
	}

	size_t length = args[0]->Uint32Value();
	auto word = wordTree.getEasyWordByLength(length);

	NanReturnValue(ws2s(word));
}
NAN_METHOD(CalcStats) {
	NanScope();

	wordTree.calcStats();

	NanReturnUndefined();
}
NAN_METHOD(Add) {
  NanScope();
    if (args.Length() < 1) {
        NanThrowTypeError("Wrong number of arguments");
        NanReturnUndefined();
    }

    if (!args[0]->IsString() ) {
        NanThrowTypeError("Wrong arguments");
        NanReturnUndefined();
    }

	String::Utf8Value utf(args[0]->ToString());
	std::wstring word = s2ws(*utf);

	wordTree.add(word);

    NanReturnUndefined();
}

NAN_METHOD(Exist) {
  NanScope();
    if (args.Length() < 1) {
        NanThrowTypeError("Wrong number of arguments");
        NanReturnUndefined();
    }

    if (!args[0]->IsString() ) {
        NanThrowTypeError("Wrong arguments");
        NanReturnUndefined();
    }

	String::Utf8Value utf(args[0]->ToString());
	std::wstring word = s2ws(*utf);

    NanReturnValue(wordTree.exist(word));
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew("add"), NanNew<FunctionTemplate>(Add)->GetFunction());
  exports->Set(NanNew("exist"), NanNew<FunctionTemplate>(Exist)->GetFunction());
  exports->Set(NanNew("clear"), NanNew<FunctionTemplate>(Clear)->GetFunction());
  exports->Set(NanNew("calcStats"), NanNew<FunctionTemplate>(CalcStats)->GetFunction());
  exports->Set(NanNew("getEasyWordByLength"), NanNew<FunctionTemplate>(getEasyWordByLength)->GetFunction());
}

NODE_MODULE(WordTree, Init)