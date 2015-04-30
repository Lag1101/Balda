#pragma once

#include <map>

class Node{
	static const int lettersCount = 33;
	static const int offset = '�';
	static const char end = '#';

	typedef std::map<char, Node> nodes_t;


	nodes_t nodes;

public:
	void add(const std::wstring & word, size_t letterNumber = 0);

	bool exist(const std::wstring & word, size_t letterNumber = 0) const;

	void clear();


};